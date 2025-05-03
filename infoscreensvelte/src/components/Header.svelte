<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import {languageStore} from '../stores/languageStore.js';

  /**
   * The `Header` component is responsible for displaying the header of the application.
   *
   * @component
   * @example
   * <Header
   *   startDate="2023-01-01"
   *   showReservationsParam={true}
   *   floorParam="5"
   *   buildingParam="KM"
   *   roomsLoaded={true}
   *   reservableTypeParam="all"
   * />
   */

  export let reservableTypeParam: 'all' | 'staff' | 'students';
  export let buildingParam: string | null;
  export let roomsLoaded: boolean;
  export let intervalParam = 15000;
  export let showUrl = false;
  export let floorParam: string | null = null;
  let interval: ReturnType<typeof setInterval>;

  /**
   * Sets up an interval to toggle the language state in the language store.
   * The interval is cleared when the component is destroyed.
   */
  onMount(() => {
    languageStore.update((state) => ({...state, intervalParam}));
    interval = setInterval(() => {
      languageStore.update((state) => ({
        ...state,
        isEnglish: !state.isEnglish
      }));
    }, intervalParam);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  const getBuildingTitle = (building: string | null, isEnglish: boolean) => {
    switch (building?.toUpperCase()) {
      case 'KM':
        return isEnglish
          ? 'Karamalmi Campus Available Rooms'
          : 'Karamalmin Kampuksen Vapaat Tilat';
      case 'MM':
        return isEnglish
          ? 'Myyrmäki Campus Available Rooms'
          : 'Myyrmäen Kampuksen Vapaat Tilat';
      case 'AR':
        return isEnglish
          ? 'Arabia Campus Available Rooms'
          : 'Arabian Kampuksen Vapaat Tilat';
      case 'MP':
        return isEnglish
          ? 'Myllypuro Campus Available Rooms'
          : 'Myllypuron Kampuksen Vapaat Tilat';
      default:
        return isEnglish ? 'Campus Available Rooms' : 'Kampuksien Vapaat Tilat';
    }
  };
</script>

{#if roomsLoaded}
  <div
    class="items-left group relative m-10 flex w-full flex-col justify-center gap-2"
  >
    <div class="flex w-full justify-between gap-2">
      <h2
        class="font-heading text-3xl font-bold text-metropoliaMainOrange transition-all duration-300"
      >
        {getBuildingTitle(buildingParam, $languageStore.isEnglish)}
        {#if floorParam}
          {$languageStore.isEnglish
            ? ` - Floor ${floorParam}`
            : ` - Kerros ${floorParam}`}
        {/if}
        {#if reservableTypeParam !== 'all'}
          {$languageStore.isEnglish
            ? `- ${reservableTypeParam === 'staff' ? 'Staff' : 'Students'}`
            : `- ${reservableTypeParam === 'staff' ? 'Henkilöstö' : 'Opiskelijat'}`}
        {/if}
      </h2>
      {#if showUrl}
        <h2
          class="hidden font-heading text-sm font-bold text-metropoliaMainOrange transition-all duration-300 md:block"
        >
          {$languageStore.isEnglish ? 'Url:  ' : 'Sivuston osoite:  '}
          {window.location.href}
        </h2>
      {/if}
      <div class="w-96"></div>
    </div>
  </div>
{/if}
