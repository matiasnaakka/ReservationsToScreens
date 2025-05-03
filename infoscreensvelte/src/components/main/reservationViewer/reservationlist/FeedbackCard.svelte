<script lang="ts">
  import {languageStore} from '../../../../stores/languageStore.js';

  const feedbackUrl = 'https://forms.gle/maeis1beZ94tQbPH9';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(feedbackUrl)}`;

  const translations = {
    en: {
      giveFeedback: 'Help us improve! 😊',
      madeBy: 'Crafted  by Aleksi Nokelainen github.com/krugou'
    },
    fi: {
      giveFeedback: 'Auta meitä kehittymään! 😊',
      madeBy: 'Tehnyt  Aleksi Nokelainen github.com/krugou'
    }
  };
</script>

<div
  class="roomcard bg-linear-to-br group relative transform overflow-hidden rounded-lg border-l-4 border-metropoliaMainOrange from-white via-metropoliaTrendLightBlue to-metropoliaTrendGreen p-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,80,0,0.3)]"
>
  <div
    class="absolute -right-12 -top-12 h-40 w-40 rotate-12 transform bg-metropoliaMainOrange opacity-10 transition-transform duration-500 group-hover:rotate-45"
  ></div>
  <div
    class="absolute -bottom-12 -left-12 h-40 w-40 -rotate-12 transform bg-metropoliaTrendGreen opacity-10 transition-transform duration-500 group-hover:-rotate-45"
  ></div>

  <h3
    class="relative mb-4 text-lg font-bold text-metropoliaMainOrange transition-all duration-300 group-hover:scale-110 group-hover:tracking-wider"
  >
    {$languageStore.isEnglish
      ? translations.en.giveFeedback
      : translations.fi.giveFeedback}
    <span
      class="absolute -right-2 -top-2 animate-ping rounded-full bg-metropoliaMainOrange p-1 opacity-75"
    ></span>
  </h3>

  <div class="relative flex justify-center p-4">
    <a
      href={feedbackUrl}
      class="group/qr relative block transform transition-all duration-300 hover:rotate-3 hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        class="bg-linear-to-r absolute -inset-2 animate-pulse rounded-lg from-metropoliaMainOrange to-metropoliaTrendGreen opacity-25 blur-lg transition-all duration-300 group-hover/qr:opacity-50"
      ></div>
      <img
        src={qrCodeUrl}
        alt="Feedback Form QR Code"
        class="relative h-32 w-32 rounded-lg shadow-lg transition-all duration-300 group-hover/qr:shadow-[0_0_20px_rgba(255,80,0,0.5)]"
      />
    </a>
  </div>

  <div class="mt-4 flex h-10 w-full items-end justify-end">
    <p
      class="relative font-body text-gray-600 transition-all duration-300 group-hover:translate-x-2"
    >
      {$languageStore.isEnglish
        ? translations.en.madeBy
        : translations.fi.madeBy}
      <span
        class="absolute bottom-0 left-0 h-0.5 w-0 bg-metropoliaMainOrange transition-all duration-300 group-hover:w-full"
      ></span>
    </p>
  </div>
</div>

<style>
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
