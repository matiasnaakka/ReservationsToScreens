<script lang="ts">
  import {uiControlStore} from '../../stores/uiControlStore';
  import {languageStore} from '../../stores/languageStore';
  import {hasAnyUrlParams} from '../../utils/urlParams';
  import type {ApiMetadata} from '../../types/api.types';
  import {translations} from '../../translations/translations';

  export let roomsLoaded: boolean;
  export let metaData: ApiMetadata;
  export let selectedFloor: string | null;
  export let selectedBuilding: string | null;
  export let position: 'top' | 'bottom' = 'bottom';

  // Get current language for translations
  $: t = translations[$languageStore.isEnglish ? 'en' : 'fi'];

  // URL Builder link
  const urlBuilderLink = 'https://krugou.github.io/infoScreenProject/params/';

  // Remove the conditional translation addition since we've added it directly to the translations object

  const handleModeChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    uiControlStore.update((controls) => ({
      ...controls,
      mode: select.value as 'map' | 'list' | null
    }));
  };

  const toggleFeedback = () => {
    uiControlStore.update((controls) => ({
      ...controls,
      showFeedback: !controls.showFeedback
    }));
  };

  const toggleAutoScroll = () => {
    uiControlStore.update((controls) => ({
      ...controls,
      autoScroll: !controls.autoScroll
    }));
  };

  // Add handler for filter changes to provide better UX feedback
  const handleFilterChange = () => {
    // This function can be expanded later to show loading indicators or other UI feedback
    console.log('Filter changed:', {
      floor: selectedFloor,
      building: selectedBuilding
    });
  };
</script>

{#if !hasAnyUrlParams()}
  <!-- Mobile controls at top -->
  {#if position === 'top'}
    <div class="mb-4 w-full md:hidden">
      {#if roomsLoaded && metaData}
        <div class="grid gap-4">
          {#if metaData.floors?.length > 0}
            <div>
              <label
                for="floor-mobile"
                class="mb-1 block font-body text-sm text-metropoliaMainGrey"
              >
                {t.selectFloor}
              </label>
              <select
                id="floor-mobile"
                class="w-full rounded-md border border-metropoliaMainGrey px-4 py-2 font-body text-sm focus:border-metropoliaMainOrange focus:outline-none"
                bind:value={selectedFloor}
                on:change={handleFilterChange}
              >
                <option value="">{t.allFloors}</option>
                {#each metaData.floors as floor}
                  <option value={floor}>{floor}</option>
                {/each}
              </select>
            </div>
          {/if}

          {#if metaData.buildings?.length > 0}
            <div>
              <label
                for="building-mobile"
                class="mb-1 block font-body text-sm text-metropoliaMainGrey"
              >
                {t.selectBuilding}
              </label>
              <select
                id="building-mobile"
                class="w-full rounded-md border border-metropoliaMainGrey px-4 py-2 font-body text-sm focus:border-metropoliaMainOrange focus:outline-none"
                bind:value={selectedBuilding}
                on:change={handleFilterChange}
              >
                <option value="">{t.allBuildings}</option>
                {#each metaData.buildings as building}
                  <option value={building}>{building}</option>
                {/each}
              </select>
            </div>
          {/if}

          <!-- Add URL Builder link for mobile -->
          <div class="mt-2">
            <a
              href={urlBuilderLink}
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full rounded-md bg-metropoliaMainOrange px-4 py-2 text-center font-body text-white hover:bg-metropoliaSecondaryOrange"
            >
              🔗 {t.urlBuilder}
            </a>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <!-- Desktop controls at bottom -->
    <div class="fixed bottom-4 right-4 hidden flex-col gap-2 md:flex">
      {#if roomsLoaded && metaData}
        <div class="grid gap-2">
          {#if metaData.floors?.length > 0}
            <div class="rounded-md bg-metropoliaSupportWhite p-2 shadow-lg">
              <label
                for="floor"
                class="mb-1 block font-body text-sm text-metropoliaMainGrey"
              >
                {t.selectFloor}
              </label>
              <select
                id="floor"
                class="w-full rounded-md border border-metropoliaMainGrey px-4 py-2 font-body text-sm focus:border-metropoliaMainOrange focus:outline-none"
                bind:value={selectedFloor}
                on:change={handleFilterChange}
              >
                <option value="">{t.allFloors}</option>
                {#each metaData.floors as floor}
                  <option value={floor}>{floor}</option>
                {/each}
              </select>
            </div>
          {/if}

          {#if metaData.buildings?.length > 0}
            <div class="rounded-md bg-metropoliaSupportWhite p-2 shadow-lg">
              <label
                for="building"
                class="mb-1 block font-body text-sm text-metropoliaMainGrey"
              >
                {t.selectBuilding}
              </label>
              <select
                id="building"
                class="w-full rounded-md border border-metropoliaMainGrey px-4 py-2 font-body text-sm focus:border-metropoliaMainOrange focus:outline-none"
                bind:value={selectedBuilding}
                on:change={handleFilterChange}
              >
                <option value="">{t.allBuildings}</option>
                {#each metaData.buildings as building}
                  <option value={building}>{building}</option>
                {/each}
              </select>
            </div>
          {/if}

          {#if $uiControlStore?.mode !== undefined}
            <div class="rounded-md bg-metropoliaSupportWhite p-2 shadow-lg">
              <label
                for="viewMode"
                class="mb-1 block font-body text-sm text-metropoliaMainGrey"
              >
                {t.viewMode}
              </label>
              <select
                id="viewMode"
                class="w-full rounded-md border border-metropoliaMainGrey px-4 py-2 font-body text-sm focus:border-metropoliaMainOrange focus:outline-none"
                value={$uiControlStore.mode || 'auto'}
                on:change={handleModeChange}
              >
                <option value="auto">{t.automatic}</option>
                <option value="map">{t.mapView}</option>
                <option value="list">{t.listView}</option>
              </select>
            </div>
          {/if}
        </div>

        {#if $uiControlStore?.showFeedback !== undefined}
          <button
            on:click={toggleFeedback}
            class="rounded-md bg-metropoliaMainOrange px-4 py-2 text-white hover:bg-metropoliaSecondaryOrange"
          >
            {$uiControlStore.showFeedback ? t.hideFeedback : t.showFeedback}
          </button>
        {/if}

        {#if $uiControlStore?.autoScroll !== undefined}
          <button
            on:click={toggleAutoScroll}
            class="rounded-md bg-metropoliaMainOrange px-4 py-2 text-white hover:bg-metropoliaSecondaryOrange"
          >
            {$uiControlStore.autoScroll ? t.stopAutoScroll : t.startAutoScroll}
          </button>
        {/if}

        <!-- Add URL Builder link for desktop -->
        <a
          href={urlBuilderLink}
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md bg-metropoliaMainGrey px-4 py-2 text-center font-body text-white hover:bg-black"
        >
          🔗 {t.urlBuilder}
        </a>
      {/if}
    </div>
  {/if}
{/if}
