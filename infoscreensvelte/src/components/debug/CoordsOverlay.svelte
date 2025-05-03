<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import {devMode} from '../../stores/devModeStore';
  import * as THREE from 'three';
  import {API_CONFIG} from '../../config/api.config';

  export let container: HTMLElement;
  export let camera: THREE.Camera | null = null;
  export let renderer: THREE.WebGLRenderer | null = null;

  let mouseX = 0;
  let mouseY = 0;
  let coords: [number, number] = [0, 0];
  let raycaster: THREE.Raycaster | null = null;
  let mouse: THREE.Vector2 | null = null;
  let plane: THREE.Plane | null = null;
  let isInitialized = false;
  let lastClickedCoords: [number, number] | null = null;

  const TOOLTIP_OFFSET = 20;

  let wallMode = true;
  let continuousMode = true;
  let startCoord: [number, number] | null = null;
  let building = 'KM';
  let floor = 7;

  let offsetX = Number(localStorage.getItem('coordsOffsetX'));
  let offsetY = Number(localStorage.getItem('coordsOffsetY'));

  const updateOffset = () => {
    localStorage.setItem('coordsOffsetX', offsetX.toString());
    localStorage.setItem('coordsOffsetY', offsetY.toString());
  };

  const initRaycaster = (
    _camera: THREE.Camera,
    _renderer: THREE.WebGLRenderer
  ) => {
    camera = _camera;
    renderer = _renderer;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
    isInitialized = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (
      !$devMode ||
      !isInitialized ||
      !mouse ||
      !raycaster ||
      !camera ||
      !plane
    )
      return;

    const rect = container.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    // Convert mouse coordinates to normalized device coordinates
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Calculate intersection with the plane
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      coords = [
        Number(intersection.x.toFixed(2)),
        Number(intersection.y.toFixed(2))
      ];
    }
  };

  const sendWallCoords = async (
    start: [number, number],
    end: [number, number]
  ) => {
    try {
      const response = await fetch(`${API_CONFIG.DEV_URL}api/coords/walls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          building,
          floor,
          start,
          end
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save wall coordinates');
      }

      const data = await response.json();
      console.log('Wall saved:', data);
    } catch (error) {
      console.error('Error saving wall:', error);
    }
  };

  const removeLastWall = async () => {
    if (!wallMode) return;

    try {
      const response = await fetch(
        `${API_CONFIG.DEV_URL}api/coords/walls/last?building=${building}&floor=${floor}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove wall');
      }

      const data = await response.json();
      console.log('Wall removed:', data);
    } catch (error) {
      console.error('Error removing wall:', error);
    }
  };

  // Reset start coord when modes change
  $: {
    if (!wallMode || !continuousMode) {
      startCoord = null;
    }
  }

  const handleClick = async (event: MouseEvent) => {
    if (!$devMode || !isInitialized) return;

    const adjustedX = coords[0] + offsetX;
    const adjustedY = coords[1] + offsetY;
    const currentCoord: [number, number] = [
      Number(adjustedX.toFixed(2)),
      Number(adjustedY.toFixed(2))
    ];

    if (wallMode) {
      if (!startCoord) {
        startCoord = currentCoord;
        console.log('Start point set:', startCoord);
      } else {
        // Always send wall coordinates if we have a start point
        await sendWallCoords(startCoord, currentCoord);
        console.log('Wall created from', startCoord, 'to', currentCoord);

        if (continuousMode) {
          startCoord = currentCoord;
          console.log('Continuous mode: new start point', startCoord);
        } else {
          startCoord = null;
          console.log('Normal mode: chain ended');
        }
      }
    } else {
      // Normal coordinate copy mode
      const coordString = `${adjustedX.toFixed(2)}, ${adjustedY.toFixed(2)}`;
      try {
        await navigator.clipboard.writeText(coordString);
        console.log('Copied to clipboard:', coordString);
        lastClickedCoords = currentCoord;
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    event.stopPropagation();
  };

  // Update initRaycaster when camera and renderer are provided
  $: if (camera && renderer && !isInitialized) {
    initRaycaster(camera, renderer);
  }

  onMount(() => {
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
  });

  onDestroy(() => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('click', handleClick);
  });
</script>

{#if $devMode}
  <!-- Move the coordinates display to follow cursor -->
  <div
    class="pointer-events-none fixed z-50 rounded bg-black/50 p-2 font-mono text-white"
    style="left: {mouseX + TOOLTIP_OFFSET}px; top: {mouseY + TOOLTIP_OFFSET}px;"
  >
    [{coords[0]}, {coords[1]}]
  </div>

  <!-- Keep instructions fixed -->
  <div class="fixed left-0 top-0 z-50 bg-black/50 p-2 font-mono text-white">
    <div class="text-xs">
      Click to copy wall coordinates.<br />
      Press 'D' to toggle dev mode.<br />
      Press 'W' to toggle wall mode.<br />
      Press 'Z' to remove last wall.
    </div>
    {#if lastClickedCoords}
      <div class="mt-1 text-xs text-green-400">
        Copied: [{lastClickedCoords[0]}, {lastClickedCoords[1]}]
      </div>
    {/if}
  </div>

  <!-- Add calibration markers -->
  <!-- <div
    class="pointer-events-none fixed left-1/2 top-1/2 z-50 flex flex-col items-center"
  >
    <div
      class="h-8 w-8 -translate-x-4 -translate-y-4 transform rounded-full border-2 border-yellow-500"
    />
    <div class="mt-2 bg-black/50 p-1 font-mono text-xs text-yellow-500">
      Calibration: [0, 0]
    </div>
    <div class="bg-black/50 p-1 font-mono text-xs text-gray-400">
      Raw coords: [{coords[0]}, {coords[1]}]
    </div>
  </div> -->

  <!-- Add offset configuration -->
  <div class="fixed right-0 top-0 z-50 bg-black/50 p-2 font-mono text-white">
    <div class="mb-2">
      <label class="block text-xs">
        Offset X:
        <input
          type="number"
          class="w-20 bg-black/50 px-1 text-white"
          bind:value={offsetX}
          on:change={updateOffset}
          step="0.1"
        />
      </label>
      <label class="block text-xs">
        Offset Y:
        <input
          type="number"
          class="w-20 bg-black/50 px-1 text-white"
          bind:value={offsetY}
          on:change={updateOffset}
          step="0.1"
        />
      </label>
    </div>

    <!-- Wall mode controls -->
    <div class="mb-2">
      <label>
        <input type="checkbox" bind:checked={wallMode} />
        Wall Mode
      </label>
    </div>
    {#if wallMode}
      <div class="mb-2">
        <label class="block">
          <input type="checkbox" bind:checked={continuousMode} />
          Continuous Mode
        </label>
      </div>
      <div class="mb-2">
        <select bind:value={building} class="bg-black/50 text-white">
          <option value="KM">KM</option>
          <!-- Add other buildings as needed -->
        </select>
      </div>
      <div class="mb-2">
        <select bind:value={floor} class="bg-black/50 text-white">
          {#each [5, 6, 7] as floorNum}
            <option value={floorNum}>Floor {floorNum}</option>
          {/each}
        </select>
      </div>
      {#if startCoord}
        <div class="text-xs text-green-400">
          Start point: [{startCoord[0]}, {startCoord[1]}]<br />
          {continuousMode
            ? 'Click to add connected walls'
            : 'Click to set end point'}
          {#if continuousMode}
            <button
              class="mt-2 rounded bg-red-500 px-2 py-1 text-xs"
              on:click={() => (startCoord = null)}
            >
              Reset Chain
            </button>
          {/if}
        </div>
      {:else}
        <div class="text-xs">Click to set start point</div>
      {/if}
    {/if}
  </div>

  <!-- Cursor crosshair -->
  <div
    class="pointer-events-none fixed z-50 h-6 w-6 -translate-x-2 -translate-y-2 transform rounded-full border-2 border-red-500"
    style="left: {mouseX}px; top: {mouseY}px;"
  ></div>
{/if}

<svelte:window
  on:keydown={(e) => {
    if (e.key.toLowerCase() === 'd') {
      $devMode = !$devMode;
    }
    if ($devMode && e.key.toLowerCase() === 'w') {
      wallMode = !wallMode;
    }
    if ($devMode && e.key.toLowerCase() === 'c') {
      if (wallMode) continuousMode = !continuousMode;
    }
    if ($devMode && wallMode && e.key.toLowerCase() === 'z') {
      removeLastWall();
    }
    if ($devMode && wallMode && e.key.toLowerCase() === 'r') {
      startCoord = null; // Reset chain
    }
  }}
/>
