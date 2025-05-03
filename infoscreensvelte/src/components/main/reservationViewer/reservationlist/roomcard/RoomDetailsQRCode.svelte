<script lang="ts">
  import {MapPin, Users, User, Ruler} from 'lucide-svelte';
  import {convert} from '../../../../../utils/hexConverter.js';
  import {languageStore} from '../../../../../stores/languageStore.js';
  import {translations} from '../../../../../translations/translations.js';
  import {getQRCodeUrl} from '../../../../../utils/getQRCodeUrl.js';
  import type {Room} from '../../../../../types/room.types.js';

  export let room: Room;
</script>

<div class="flex justify-end">
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
      class="h-32 w-32 rounded-lg shadow-lg transition-all duration-300 group-hover/qr:shadow-[0_0_20px_rgba(255,80,0,0.5)]"
    />
  </a>
</div>
