<script lang="ts">
  import {languageStore} from '../../../../../stores/languageStore.js';
  import type {Room} from '../../../../../types/room.types.js';
  import {getQRCodeUrl} from '$utils/getQRCodeUrl.js';

  export let room: Room;

  const translations = {
    en: {
      qrTitle: 'Open QR code in new tab',
      qrAlt: 'QR Code for room'
    },
    fi: {
      qrTitle: 'Avaa QR-koodi uudessa välilehdessä',
      qrAlt: 'QR-koodi huoneelle'
    }
  };

  getQRCodeUrl(room.roomNumber);
</script>

<a
  href={getQRCodeUrl(room.roomNumber)}
  target="_blank"
  rel="noopener noreferrer"
  class="group/qr relative block transform transition-all duration-300 hover:rotate-3 hover:scale-110"
  title={$languageStore.isEnglish
    ? translations.en.qrTitle
    : translations.fi.qrTitle}
>
  <img
    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getQRCodeUrl(room.roomNumber))}`}
    alt={`${$languageStore.isEnglish ? translations.en.qrAlt : translations.fi.qrAlt} ${room.roomNumber}`}
    class="relative h-24 w-24 rounded-lg shadow-lg transition-all duration-300 group-hover/qr:shadow-[0_0_20px_rgba(255,80,0,0.5)]"
  />
  <!-- below size is too small for qr code -->
  <!-- <img
    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getQRCodeUrl(room.roomNumber))}`}
    alt={`QR Code for room ${room.roomNumber}`}
    class="relative h-8 w-8 rounded-lg shadow-lg transition-all duration-300 group-hover/qr:shadow-[0_0_20px_rgba(255,80,0,0.5)]"
  /> -->
</a>
