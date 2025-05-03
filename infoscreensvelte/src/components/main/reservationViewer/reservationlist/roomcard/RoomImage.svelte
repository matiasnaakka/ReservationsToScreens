<script lang="ts">
  import {languageStore} from '../../../../../stores/languageStore.js';
  import type {Room} from '../../../../../types/room.types.js';

  export let room: Room;

  const translations = {
    en: {
      openFullScreenImage: 'Open full screen image of room',
      roomImageAlt: 'Room',
      noImageAvailable: 'No image available'
    },
    fi: {
      openFullScreenImage: 'Avaa tilan kuva koko näytölle',
      roomImageAlt: 'Tila',
      noImageAvailable: 'Ei kuvaa saatavilla'
    }
  };

  let imageLoaded = false;
  let imageError = false;

  const handleImageLoad = () => {
    imageLoaded = true;
    imageError = false;
  };

  const handleImageError = () => {
    imageLoaded = true;
    imageError = true;
  };

  const openFullScreen = () => {
    if (imageError) return;

    const img = document.getElementById(`room-img-${room.roomNumber}`);
    if (img) {
      img.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      img.style.objectFit = 'contain';
    }
  };
</script>

<div class="group relative flex space-y-3">
  <div
    class="shrink-0 transform transition-all duration-300 group-hover:scale-125"
  >
    {#if !imageLoaded}
      <div class="h-24 w-24 animate-pulse rounded-lg bg-gray-200"></div>
    {/if}
    <button
      type="button"
      on:click={openFullScreen}
      on:keydown={(e) => e.key === 'Enter' && openFullScreen()}
      class="rounded-lg focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange focus:ring-offset-2"
      title={`${$languageStore.isEnglish ? translations.en.openFullScreenImage : translations.fi.openFullScreenImage} ${room.roomNumber}`}
      class:cursor-not-allowed={imageError}
      class:opacity-70={imageError}
    >
      {#if imageError}
        <div
          class="ml-1 mt-2 flex h-32 w-44 items-center justify-center rounded-lg bg-gray-100 text-center font-body text-sm text-metropoliaMainGrey"
        >
          <p>
            {$languageStore.isEnglish
              ? translations.en.noImageAvailable
              : translations.fi.noImageAvailable}
          </p>
        </div>
      {:else}
        <img
          on:load={handleImageLoad}
          on:error={handleImageError}
          id={`room-img-${room.roomNumber}`}
          src={`https://krugou.github.io/infoScreenProject/rooms/${room.roomNumber}.jpg`}
          alt={`${$languageStore.isEnglish ? translations.en.roomImageAlt : translations.fi.roomImageAlt} ${room.roomNumber}`}
          class="ml-1 mt-2 h-32 w-44 rounded-lg object-cover transition-opacity duration-300"
          class:opacity-0={!imageLoaded}
          class:opacity-100={imageLoaded}
        />
      {/if}
    </button>
  </div>
</div>
