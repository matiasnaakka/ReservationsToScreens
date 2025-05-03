<script lang="ts">
  import {languageStore} from '../../../../../stores/languageStore.js';
  import {translations} from '../../../../../translations/translations.js';
  import type {Room} from '../../../../../types/room.types.js';

  export let room: Room;
</script>

<div class="flex-1 break-words">
  <div
    class="text- metropoliaMainGrey flex flex-col font-body text-base font-bold"
  >
    <span class="">
      {$languageStore.isEnglish ? translations.en.floor : translations.fi.floor}
      {room.floor}
    </span>
    <span class="">
      {$languageStore.isEnglish ? translations.en.wing : translations.fi.wing}
      {room.wing}
    </span>
  </div>

  <div
    class="text- metropoliaMainGrey flex items-center gap-2 font-body text-base font-bold"
  >
    <span class="">
      {room.persons}
      {parseInt(room.persons) === 1
        ? $languageStore.isEnglish
          ? translations.en.person
          : translations.fi.person
        : $languageStore.isEnglish
          ? translations.en.persons
          : translations.fi.persons}
    </span>
  </div>

  {#if room.squareMeters !== '0'}
    <div
      class="text- metropoliaMainGrey flex gap-2 font-body text-base font-bold"
    >
      <span class="">
        {room.squareMeters}
        {$languageStore.isEnglish
          ? translations.en.squareMeters
          : translations.fi.squareMeters}
      </span>
    </div>
  {/if}
</div>
