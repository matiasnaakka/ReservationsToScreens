<script lang="ts">
  import {languageStore} from '../../../../../stores/languageStore.js';
  import type {Room} from '../../../../../types/room.types.js';
  import type {Reservation} from '../../../../../types/reservation.types.js';
  import {translations} from '../../../../../translations/translations.js';
  import RoomPermissions from './RoomPermissions.svelte';
  import RoomAvailability from './RoomAvailability.svelte';

  export let room: Room;
  export let nextReservation: Reservation | null;
</script>

<div class="flex h-full w-1/2 flex-col justify-between gap-1">
  <div class="flex flex-col">
    <p
      class="group relative break-words font-body text-sm font-bold text-metropoliaMainGrey transition-all duration-300 hover:translate-x-1"
      aria-label={$languageStore.isEnglish ? 'Room details' : 'Huoneen tiedot'}
    >
      {$languageStore.isEnglish
        ? translations.en.details[room.details]
        : translations.fi.details[room.details]}
      <span
        class="absolute bottom-0 left-0 h-0.5 w-0 bg-metropoliaMainOrange transition-all duration-300 group-hover:w-full"
        aria-hidden="true"
      ></span>
    </p>
  </div>
  <RoomAvailability
    {nextReservation}
    closingTime={room.closingTime}
    {translations}
  />
  <RoomPermissions
    reservableStaff={room.reservableStaff}
    reservableStudents={room.reservableStudents}
  />
</div>
