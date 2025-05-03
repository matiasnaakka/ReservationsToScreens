<script lang="ts">
  import {UserSquare2} from 'lucide-svelte';
  import RoomImage from './roomcard/RoomImage.svelte';
  import RoomDetailsQRCode from './roomcard/RoomDetailsQRCode.svelte';
  import DetailsAndAvailability from './roomcard/DetailsAndAvailability.svelte';
  import {languageStore} from '../../../../stores/languageStore.js';
  import type {Room} from '../../../../types/room.types.js';
  import type {
    Reservation,
    Resource
  } from '../../../../types/reservation.types.js';
  import RoomInfo from './roomcard/RoomInfo.svelte';

  export let room: Room;
  export let reservations: Reservation[];

  const getNextReservation = (roomNumber: string): Reservation | null => {
    if (!reservations?.length) return null;
    const now = new Date();
    const roomReservations = reservations
      .filter((res) =>
        res.resources.some((r: Resource) => r.code === roomNumber)
      )
      .filter((res) => new Date(res.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    return roomReservations[0] || null;
  };

  $: nextReservation = getNextReservation(room.roomNumber);

  const urlParams = new URLSearchParams(window.location.search);
  const intervalParam = parseInt(
    urlParams.get('translationInterval') || '15000',
    10
  );
  let intervalId: number;
</script>

<div
  class="roomcard group relative transform overflow-hidden rounded-lg border-4 bg-metropoliaSupportWhite p-3 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,80,0,0.3)]"
  class:border-metropoliaTrendGreen={!nextReservation}
  class:border-metropoliaSupportRed={nextReservation}
>
  <div
    class="relative flex items-center justify-center"
    title="Floor color code"
  >
    <div
      class="absolute my-1 h-1.5 w-16 rounded-xl"
      style="background-color: {room.floorColorCode};"
    ></div>
  </div>
  <div
    class="absolute -right-12 -top-12 h-40 w-40 rotate-12 transform bg-metropoliaMainOrange opacity-10 transition-transform duration-500 group-hover:rotate-45"
  ></div>
  <div
    class="absolute -bottom-12 -left-12 h-40 w-40 -rotate-12 transform bg-metropoliaTrendGreen opacity-10 transition-transform duration-500 group-hover:-rotate-45"
  ></div>

  <div class="relative flex items-start justify-between">
    <div>
      <h3
        class="flex items-center gap-2 font-heading text-lg font-bold text-metropoliaMainOrange transition-all duration-300 group-hover:scale-110 group-hover:tracking-wider"
      >
        {room.roomNumber}
      </h3>
      <RoomInfo {room} />
    </div>
    <RoomImage {room} />
  </div>

  <div class=" flex justify-between gap-2">
    <DetailsAndAvailability {room} {nextReservation} />
    <RoomDetailsQRCode {room} />
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
