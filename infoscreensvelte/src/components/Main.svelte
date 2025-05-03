<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import MainAnimation from './main/MainAnimation.svelte';
  import ReservationViewer from './main/ReservationViewer.svelte';
  import Feedback from './main/Feedback.svelte';
  import {isActive, INACTIVITY_TIMEOUT} from '../stores/activityStore.js';
  import type {Room} from '../types/Room';
  import {freeSpaceStore} from '../stores/freeSpaceStore.js';
  import {roomCoordsStore} from '../stores/roomCoordsStore.js';
  import {fetchFreeSpace} from '../hooks/useApi.js';
  import Controls from './main/Controls.svelte';
  import {uiControlStore} from '../stores/uiControlStore';
  import {hasAnyUrlParams} from '../utils/urlParams';
  import {get} from 'svelte/store';
  import {validateDateUtil} from '../utils/validateDateUtil.js';

  const browser = typeof window !== 'undefined';
  let activityTimer: ReturnType<typeof setTimeout>;
  let feedbackTimer: ReturnType<typeof setTimeout>;
  let showFeedback = false;
  let combinedRoomData: Room[] = [];
  let updateInterval: ReturnType<typeof setInterval>;
  let roomsLoaded = false;
  let currentError: string | null = null;

  // URL parameters
  let floorParam: string | null = null;
  let buildingParam: string | null = null;
  let showFeedbackParam = false;
  let specificDateParam: string | null = null;
  let reservableTypeParam: 'all' | 'staff' | 'students' = 'all';
  let groupDetailsParam: string | null = null;
  let updateIntervalParam = 15000;
  let updateFreeSpaceInterval = 60000;
  let details = '';
  // use start of the day for startdate
  let startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  // Auto-scroll parameters
  let autoScrollParam = false;
  let scrollSpeedParam = 1;
  let scrollIntervalParam = 50;
  let scrollPauseParam = 1000;

  const currentDevStatus = true;

  // Add state for selected filters
  let selectedFloor: string | null = floorParam;
  let selectedBuilding: string | null = buildingParam;

  // New URL parameter for parameter demo mode
  let showParamDemo = false;

  // For marquee effect
  let paramTextElement: HTMLElement;
  let isParamTextOverflowing = false;
  let paramTextWidth = 0;
  let containerWidth = 0;

  // Check if parameters text is overflowing
  const checkOverflow = () => {
    if (paramTextElement && browser) {
      paramTextWidth = paramTextElement.scrollWidth;
      containerWidth = paramTextElement.parentElement?.clientWidth || 0;
      isParamTextOverflowing = paramTextWidth > containerWidth;
    }
  };

  /**
   * Resets the inactivity timer and sets the `isActive` store to true.
   */
  const resetTimer = () => {
    clearTimeout(activityTimer);
    clearTimeout(feedbackTimer);
    showFeedback = false;
    const isDev = import.meta.env.MODE === 'development';
    $isActive = isDev ? currentDevStatus : true;

    // Different timeouts for dev and prod modes
    const inactivityTimeout = isDev ? 450000 : INACTIVITY_TIMEOUT; // 7.5 minutes in dev, normal timeout in prod
    const feedbackDelay = isDev ? 450000 : 45000;

    activityTimer = setTimeout(() => {
      $isActive = false;
      // Start feedback timer after inactivity
      feedbackTimer = setTimeout(() => {
        showFeedback = true;
      }, feedbackDelay);
    }, inactivityTimeout);
  };

  /**
   * Handles user activity by resetting the inactivity timer.
   */
  const handleActivity = () => {
    resetTimer();
  };

  /**
   * Parse all URL parameters for the application
   */
  const parseUrlParams = () => {
    if (!browser) return;

    const params = new URLSearchParams(window.location.search);
    const floorYouAreHere = Number(params.get('floorYouAreHere')) || 5;
    // Basic parameters
    floorParam = params.get('floor');
    buildingParam = params.get('building') || null;
    showFeedbackParam = params.get('showFeedback') === 'true';
    specificDateParam = params.get('specificdate');
    reservableTypeParam =
      (params.get('reservable') as 'all' | 'staff' | 'students') || 'all';
    details = params.get('details') || '';

    // Retrieve group details parameter
    groupDetailsParam = params.get('groupDetails') || '';

    // Check for param demo mode
    showParamDemo = params.get('showParamDemo') === 'true';

    // Update intervals
    updateIntervalParam = parseInt(params.get('updateInterval') || '15000', 10);

    updateFreeSpaceInterval = parseInt(
      params.get('updateFreeSpaceInterval') || '60000',
      10
    );

    // Auto-scroll parameters
    autoScrollParam = params.get('autoScroll') === 'true';
    scrollSpeedParam = parseInt(params.get('scrollSpeed') || '1', 10);
    scrollIntervalParam = parseInt(params.get('scrollInterval') || '50', 10);
    scrollPauseParam = parseInt(params.get('scrollPause') || '1000', 10);

    // Handle specific date if provided
    if (specificDateParam) {
      const validatedDate = validateDateUtil(specificDateParam);
      if (validatedDate) {
        startDate = validatedDate.toISOString();
      } else {
        currentError = 'Invalid date format. Use YYYY-MM-DD format.';
      }
    }

    // Parse position and view mode parameters
    const x = Number(params.get('x')) || 3;
    const y = Number(params.get('y')) || 6.4;
    const floor = Number(params.get('floor')) || 5;
    const mode = params.get('mode') as 'map' | 'list' | null;

    // Initialize uiControlStore with URL parameters
    uiControlStore.set({
      mode,
      showFeedback: showFeedbackParam,
      autoScroll: autoScrollParam,
      scrollSpeed: scrollSpeedParam,
      scrollInterval: scrollIntervalParam,
      scrollPause: scrollPauseParam
    });

    return {x, y, floor, floorYouAreHere};
  };

  // Get all current URL parameters for display in demo mode
  const getCurrentParams = () => {
    if (!browser) return [];

    const params = new URLSearchParams(window.location.search);
    return Array.from(params.entries());
  };

  /**
   * Loads free space data from the API
   */
  const loadFreeSpace = async () => {
    try {
      freeSpaceStore.update((state) => ({
        ...state,
        loading: true,
        error: null
      }));

      const {rooms, metadata} = await fetchFreeSpace({
        floor: selectedFloor || floorParam || '',
        building: selectedBuilding || buildingParam || '',
        startDate: startDate,
        endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        reservableStudents: reservableTypeParam === 'students' ? 'true' : '',
        reservableStaff: reservableTypeParam === 'staff' ? 'true' : '',
        details: details || '',
        groupDetails: groupDetailsParam || ''
      });

      freeSpaceStore.update((state) => ({
        ...state,
        loading: false,
        error: null,
        data: rooms,
        metadata: {
          floors: metadata.floors,
          buildings: metadata.buildings
        }
      }));

      roomsLoaded = true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load free space data';

      freeSpaceStore.update((state) => ({
        ...state,
        loading: false,
        error: new Error(errorMessage)
      }));

      currentError = errorMessage;
    }
  };

  /**
   * Sets up event listeners for user activity and initializes the inactivity timer.
   */
  onMount(() => {
    if (browser) {
      resetTimer();
      loadFreeSpace(); // Initial load
      updateInterval = setInterval(loadFreeSpace, updateFreeSpaceInterval);

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('touchstart', handleActivity);

      // Set up resize observer for the params marquee
      if (browser) {
        const resizeObserver = new ResizeObserver(() => {
          checkOverflow();
        });

        if (paramTextElement) {
          resizeObserver.observe(paramTextElement);
        }

        return () => {
          resizeObserver.disconnect();
          clearInterval(updateInterval);
          window.removeEventListener('mousemove', handleActivity);
          window.removeEventListener('keypress', handleActivity);
          window.removeEventListener('click', handleActivity);
          window.removeEventListener('touchstart', handleActivity);
        };
      }
    }
  });

  /**
   * Cleans up event listeners and clears the inactivity timer when the component is destroyed.
   */
  onDestroy(() => {
    if (browser) {
      clearTimeout(activityTimer);
      clearTimeout(feedbackTimer);
      clearInterval(updateInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    }
  });

  // Get position coordinates from URL params
  const coords = parseUrlParams() || {x: 3, y: 6.4, floorYouAreHere: 5};

  // Combine room coordinates with reservation status
  $: {
    const isDev = import.meta.env.MODE === 'development';
    const processedRooms = $roomCoordsStore.map((room) => {
      const reservationData = $freeSpaceStore.data?.find(
        (r) => r.roomNumber === room.key
      );

      // In production, if room is occupied, return null (to be filtered out)
      if (!isDev && reservationData?.currentReservation) {
        return null;
      }
      // if params is students filter them out
      if (
        (reservableTypeParam === 'staff' &&
          reservationData?.reservableStaff === 'false') ||
        (reservableTypeParam === 'students' &&
          reservationData?.reservableStudents === 'false')
      ) {
        return null;
      }
      return {
        ...room,
        status: reservationData?.currentReservation
          ? 'occupied'
          : reservationData?.nextReservation
            ? 'reserved'
            : 'free'
      } as Room;
    });

    // Filter out null values in production mode
    combinedRoomData = processedRooms.filter(
      (room): room is Room => room !== null
    );
  }

  // Filter rooms based on selected floor and building
  $: filteredRoomData = combinedRoomData.filter((room) => {
    // Floor filtering logic
    if (selectedFloor && room.floor !== parseInt(selectedFloor, 10)) {
      return false;
    }

    // Building filtering logic
    if (selectedBuilding) {
      const roomData = $freeSpaceStore.data?.find(
        (r) => r.roomNumber === room.key
      );
      if (roomData?.building !== selectedBuilding) {
        return false;
      }
    }

    return true;
  });

  // Watch for changes in filters and reload data
  $: {
    if (
      browser &&
      (selectedFloor !== floorParam || selectedBuilding !== buildingParam)
    ) {
      loadFreeSpace();
    }
  }

  // Modified currentView logic to handle null mode
  $: currentView = (() => {
    // If mode is explicitly set (not auto and not null), use that
    if ($uiControlStore.mode && $uiControlStore.mode !== 'auto') {
      return $uiControlStore.mode;
    }
    // In auto mode or null mode, base it on isActive
    return $isActive ? 'list' : 'map';
  })();
</script>

<main class="flex h-full w-full flex-col">
  {#if showParamDemo}
    <div
      class="hide-scrollbar w-full overflow-hidden bg-metropoliaMainOrange px-4 py-2 font-mono text-sm text-white"
    >
      <div class="flex items-center">
        <span class="mr-2 font-bold">PARAMS:</span>
        <span
          bind:this={paramTextElement}
          class="marquee-text"
          class:animate-marquee={isParamTextOverflowing}
          style="--container-width: {containerWidth}px; --text-width: {paramTextWidth}px;"
        >
          {#each getCurrentParams() as [key, value], i}
            <span class="param-item">
              <span class="font-bold">{key}</span>
              <span class="text-metropoliaTrendYellow mx-1 font-bold">=</span>
              <span class="text-metropoliaSupportWhite">{value}</span>
              {#if i < getCurrentParams().length - 1}
                <span class="mx-2 text-metropoliaTrendLightBlue">|</span>
              {/if}
            </span>
          {/each}
        </span>
      </div>
    </div>
  {/if}

  <div class="flex flex-1 items-center justify-center p-1">
    {#if $uiControlStore.showFeedback || showFeedbackParam || showFeedback}
      <Feedback />
    {:else if currentView === 'list'}
      <ReservationViewer
        {roomsLoaded}
        {currentError}
        {floorParam}
        {buildingParam}
        {reservableTypeParam}
        {updateIntervalParam}
        {details}
      />
    {:else}
      <MainAnimation
        youAreHereCoordsX={coords.x}
        youAreHereCoordsY={coords.y}
        youAreHereFloorNum={coords.floorYouAreHere}
        rooms={filteredRoomData}
        selectedFloor={selectedFloor ? parseInt(selectedFloor, 10) : null}
      />
    {/if}
    {#if !hasAnyUrlParams()}
      <Controls
        position="bottom"
        {roomsLoaded}
        metaData={$freeSpaceStore.metadata}
        bind:selectedFloor
        bind:selectedBuilding
      />
    {/if}
  </div>
</main>

<style>
  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Marquee animation */
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(calc(var(--container-width) - var(--text-width)));
    }
    75% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(0);
    }
  }

  .marquee-text {
    display: inline-block;
    white-space: nowrap;
  }

  .animate-marquee {
    animation: marquee 30s linear infinite;
    animation-play-state: running;
  }

  .animate-marquee:hover {
    animation-play-state: paused;
  }

  .param-item {
    display: inline-flex;
    align-items: center;
  }
</style>
