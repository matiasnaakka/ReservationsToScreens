<script lang="ts">
  import {freeSpaceStore} from '../../stores/freeSpaceStore.js';
  import {onMount, onDestroy} from 'svelte';
  import ReservationList from './reservationViewer/ReservationList.svelte';
  import Dropdowns from './reservationViewer/Dropdowns.svelte';
  import URLParametersGuide from './reservationViewer/URLParametersGuide.svelte';
  import Header from '../Header.svelte';
  import LoadingSkeleton from './reservationViewer/LoadingSkeleton.svelte';
  import {uiControlStore} from '../../stores/uiControlStore';
  import {hasAnyUrlParams} from '../../utils/urlParams';
  import Controls from './Controls.svelte';

  // Props from Main.svelte
  export let roomsLoaded = false;
  export let currentError: string | null = null;
  export let floorParam: string | null = null;
  export let buildingParam: string | null = null;
  export let reservableTypeParam: 'all' | 'staff' | 'students' = 'all';
  export let updateIntervalParam = 15000;

  let selectedFloor: string | null = null;
  let selectedBuilding: string | null = null;
  let showDropdowns = true;
  let scrollContainerRef: HTMLDivElement;
  let scrollInterval: ReturnType<typeof setInterval>;
  let scrollingDown = true;
  let showReservationsParam = false;

  onMount(() => {
    if (floorParam || buildingParam) {
      showDropdowns = false;
      selectedFloor = floorParam || '';
      selectedBuilding = buildingParam || '';
    } else {
      showDropdowns = true;
      selectedBuilding = '';
      selectedFloor = '';
    }

    if ($uiControlStore.autoScroll) {
      startScrolling();
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  });

  const startScrolling = () => {
    if (scrollInterval) return;

    scrollInterval = setInterval(() => {
      if (!scrollContainerRef) return;

      const maxScroll =
        scrollContainerRef.scrollHeight - scrollContainerRef.clientHeight;

      if (maxScroll <= 0) return; // No need to scroll if content fits

      if (scrollingDown) {
        if (scrollContainerRef.scrollTop >= maxScroll) {
          setTimeout(
            () => (scrollingDown = false),
            $uiControlStore.scrollPause
          );
        } else {
          scrollContainerRef.scrollTop += $uiControlStore.scrollSpeed;
        }
      } else {
        if (scrollContainerRef.scrollTop <= 0) {
          setTimeout(() => (scrollingDown = true), $uiControlStore.scrollPause);
        } else {
          scrollContainerRef.scrollTop -= $uiControlStore.scrollSpeed;
        }
      }
    }, $uiControlStore.scrollInterval);
  };

  $: if (selectedFloor || selectedBuilding) {
    // Update the free space store filters instead of fetching again
    freeSpaceStore.update((state) => ({
      ...state,
      filters: {
        ...state.filters,
        floor: selectedFloor || '',
        building: selectedBuilding || ''
      }
    }));
  }

  $: if ($uiControlStore.autoScroll) {
    startScrolling();
  } else if (scrollInterval) {
    clearInterval(scrollInterval);
    // @ts-expect-error   // This is intentional
    scrollInterval = undefined;
  }

  onDestroy(() => {
    if (scrollInterval) clearInterval(scrollInterval);
  });
</script>

<div class="h-screen w-full p-2">
  <Header
    {reservableTypeParam}
    {buildingParam}
    {floorParam}
    {roomsLoaded}
    intervalParam={updateIntervalParam}
  />

  {#if !hasAnyUrlParams()}
    <Controls
      position="top"
      {roomsLoaded}
      metaData={$freeSpaceStore.metadata}
      bind:selectedFloor
      bind:selectedBuilding
    />
  {/if}

  {#if !buildingParam}
    <URLParametersGuide />
  {/if}

  {#if $freeSpaceStore.loading && roomsLoaded}
    <LoadingSkeleton />
  {:else if currentError || $freeSpaceStore.error}
    <div
      class="rounded-sm border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      <div>Hey, Looks like we have an error?</div>
      <p>{currentError || $freeSpaceStore.error?.message}</p>
    </div>
  {:else if showReservationsParam && ($freeSpaceStore.data?.length === 0 || $freeSpaceStore.data === null)}
    <div class="text-center text-gray-500">
      <p>
        No reservations found {#if selectedFloor}for floor {selectedFloor}{/if}
      </p>
    </div>
  {:else if $freeSpaceStore.data}
    <div
      class="hide-scrollbar h-[calc(100vh-12rem)] overflow-auto"
      bind:this={scrollContainerRef}
    >
      <ReservationList reservationData={$freeSpaceStore?.data} />
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
  {/if}
</div>
