<!-- filepath: c:\Users\moxch\Documents\GitHub\infoScreenProject\src\components\main\Feedback.svelte -->
<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import ParticleOverlay from './feedback/ParticleOverlay.svelte';
  import {fade, fly} from 'svelte/transition';
  import {elasticOut} from 'svelte/easing';

  const translations = {
    en: {
      title: 'Your feedback matters!',
      description: 'Scan the QR code to share your thoughts with us.',
      roomFeedback: 'Help us enhance our available rooms info system!',
      madeBy: 'Crafted by Aleksi Nokelainen github.com/krugou'
    },
    fi: {
      title: 'Palautteesi on tärkeää!',
      description: 'Skannaa QR-koodi jakaaksesi ajatuksesi kanssamme.',
      roomFeedback: 'Auta meitä kehittämään vapaiden tilojen infojärjestelmää!',
      madeBy: 'Tehnyt Aleksi Nokelainen github.com/krugou'
    }
  };

  type Language = 'en' | 'fi';
  let currentLanguage: Language = 'en';
  let intervalId: ReturnType<typeof setInterval>;
  let container: HTMLElement;
  let showEmoji = false;
  let emojis = ['✨', '🚀', '👍', '🎯', '💡', '🌈'];
  let currentEmojiIndex = 0;

  const feedbackUrl = 'https://forms.gle/maeis1beZ94tQbPH9';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(feedbackUrl)}`;

  onMount(() => {
    intervalId = setInterval(() => {
      currentLanguage = currentLanguage === 'en' ? 'fi' : 'en';
    }, 10000);

    // Show emoji every 5 seconds
    setInterval(() => {
      showEmoji = true;
      currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
      setTimeout(() => (showEmoji = false), 1500);
    }, 5000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  $: texts = translations[currentLanguage];
</script>

<div
  bind:this={container}
  class="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-metropoliaMainOrange to-metropoliaSupportBlue px-4 py-8 md:px-8 md:py-12"
>
  {#if container}
    <ParticleOverlay {container} />
  {/if}

  <!-- Simple background blur -->
  <div
    class="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-metropoliaTrendPink/20 blur-3xl"
  ></div>

  <div
    class="relative z-10 mx-auto my-8 flex max-w-5xl flex-col items-center rounded-3xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg md:my-16 md:p-8 lg:flex-row lg:gap-16"
  >
    <!-- Content -->
    <div
      class="flex flex-col items-center text-center lg:items-start lg:text-left"
    >
      {#key currentLanguage}
        <h2
          in:fly={{y: -20, duration: 400, easing: elasticOut}}
          class="mb-4 font-heading text-4xl font-extrabold text-white drop-shadow-lg md:mb-6 md:text-5xl lg:text-6xl"
        >
          {texts.title}
          {#if showEmoji}
            <span
              class="absolute ml-2 animate-bounce text-2xl md:text-4xl"
              in:fly={{y: -20, duration: 300}}
              out:fade={{duration: 200}}
            >
              {emojis[currentEmojiIndex]}
            </span>
          {/if}
        </h2>
      {/key}

      {#key currentLanguage}
        <p
          in:fly={{y: 20, duration: 400, delay: 100}}
          class="mb-4 font-heading text-2xl font-bold text-white drop-shadow-lg md:mb-6 md:text-3xl"
        >
          {texts.roomFeedback}
        </p>
      {/key}

      {#key currentLanguage}
        <p
          in:fly={{y: 20, duration: 400, delay: 200}}
          class="mb-6 font-body text-lg font-bold text-white drop-shadow-lg md:mb-8 md:text-xl"
        >
          {texts.description}
        </p>
      {/key}

      <!-- QR Code with simplified effects -->
      <div class="group mb-6 md:mb-0">
        <div class="relative transition-all duration-500 group-hover:scale-105">
          <div
            class="absolute -inset-2 rounded-xl bg-gradient-to-r from-metropoliaMainOrange to-metropoliaSupportBlue opacity-75 blur-md"
          ></div>
          <div class="relative rounded-xl bg-white p-3 md:p-4">
            <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={qrCodeUrl}
                alt="Feedback Form QR Code"
                class="h-36 w-36 rounded-lg md:h-48 md:w-48"
              />
            </a>
          </div>
        </div>
      </div>

      {#key currentLanguage}
        <p
          in:fly={{y: 20, duration: 400, delay: 300}}
          class="mt-6 font-body text-sm font-bold text-white/90 drop-shadow md:mt-8 md:text-base"
        >
          {texts.madeBy}
        </p>
      {/key}
    </div>

    <div class="relative mt-8 w-36 animate-pulse md:w-48 lg:mt-0 lg:w-80">
      <img
        src="https://krugou.github.io/infoScreenProject/manpointing.svg"
        alt="Man Pointing"
        class="w-full drop-shadow-xl invert filter transition-transform duration-300 hover:scale-110"
      />
    </div>
  </div>
</div>

<style>
  /* Using Tailwind classes for most animations to reduce custom CSS */

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-15px) scale(1.2);
    }
  }

  :global(.animate-bounce) {
    animation: bounce 0.5s forwards;
  }
</style>
