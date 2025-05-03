<script lang="ts">
  import '../app.css';
  let {children} = $props();
  import {onMount} from 'svelte';

  onMount(() => {
    console.log('Build by Aleksi Nokelainen 2025 github.com/krugou');
  });
</script>

<div
  class="flex h-full min-h-screen flex-col bg-metropoliaSupportWhite font-heading"
>
  <main class="flex-1">
    {@render children()}
  </main>

  <!-- <Footer /> -->
</div>
