<script lang="ts">
  import RoomCard from './reservationlist/RoomCard.svelte';
  import FeedbackCard from './reservationlist/FeedbackCard.svelte';
  import type {Room} from '../../../types/room.types.js';
  import type {Reservation} from '../../../types/reservation.types.js';

  export let reservationData: Room[] = [];

  // Filter out rooms with currentReservation
  $: filteredRooms = reservationData.filter((room) => !room.currentReservation);

  // Extract all reservations from rooms with room information
  $: reservations = reservationData
    .flatMap((room) => [
      room.currentReservation
        ? {...room.currentReservation, roomNumber: room.roomNumber}
        : null,
      room.nextReservation
        ? {...room.nextReservation, roomNumber: room.roomNumber}
        : null
    ])
    .filter((res): res is Reservation & {roomNumber: string} => res !== null);
</script>

<div
  class=" relative grid grid-cols-1 gap-6 overflow-hidden p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
>
  {#each filteredRooms as room, i (room.roomNumber)}
    <!-- <div class="animate-fadeIn" style="animation-delay: {i * 0.011}s"> -->
    <div>
      <RoomCard {room} {reservations} />
    </div>
  {/each}
  <!-- <div
    class="animate-fadeIn"
    style="animation-delay: {reservationData.length * 0.1}s"
  >
    <FeedbackCard />
  </div> -->
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  :global(.animate-fadeIn) {
    opacity: 0;
  }
</style>
