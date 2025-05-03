<script lang="ts">
  export let count = 15;
</script>

<div class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
  {#each Array(count) as _, i}
    <div class="animate-pulse rounded-lg bg-white p-4 shadow-lg" style="animation-delay: {i * 0.1}s">
      <!-- Room number skeleton -->
      <div class="mb-4 flex items-start justify-between">
        <div class="h-6 w-32 rounded-sm bg-gray-200"></div>
        <div class="h-24 w-24 rounded-sm bg-gray-200"></div>
      </div>

      <!-- Room details skeleton -->
      <div class="mb-4 space-y-3">
        <div class="flex justify-between">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
              <div class="h-4 w-32 rounded-sm bg-gray-200"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
              <div class="h-4 w-24 rounded-sm bg-gray-200"></div>
            </div>

            <div class="flex items-center gap-1">
              <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
              <div class="h-4 w-28 rounded-sm bg-gray-200"></div>
            </div>
          </div>
          <div class="h-24 w-24 rounded-sm bg-gray-200"></div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex flex-col justify-between">
          <div class="h-4 w-28 rounded-sm bg-gray-200"></div>
          <div class="flex h-16 w-16 items-center justify-start gap-2">
            <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
            <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
          </div>
        </div>
        <div class="flex justify-between gap-2">
          <div class="h-5 w-5 rounded-sm bg-gray-200"></div>
          <div class="h-5 w-28 rounded-sm bg-gray-200"></div>
        </div>
      </div>
    </div>
  {/each}
</div>
