<script lang="ts">
  import type {ApiMetadata} from '../../../types/api.types';

  export let roomsLoaded: boolean;
  export let metaData: ApiMetadata;
  export let selectedFloor: string | null;
  export let selectedBuilding: string | null;
</script>

{#if roomsLoaded}
	<div class="mb-4 flex justify-between">
		<div class="mb-4">
			<label for="floor" class="block text-sm font-medium text-gray-700">Select Floor</label>
			<select
				id="floor"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				bind:value={selectedFloor}
			>
				<option value="">All Floors</option>
				{#each metaData.floors as floor}
					<option value={floor}>{floor}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="building" class="block text-sm font-medium text-gray-700">Select Building</label>
			<select
				id="building"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				bind:value={selectedBuilding}
			>
				<option value="">All Buildings</option>
				{#each metaData.buildings as building}
					<option value={building}>{building}</option>
				{/each}
			</select>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center">
		<div
			class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
{/if}
