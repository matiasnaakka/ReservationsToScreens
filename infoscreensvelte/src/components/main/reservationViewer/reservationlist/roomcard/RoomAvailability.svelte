<script lang="ts">
  import {Clock} from 'lucide-svelte';
  import {languageStore} from '../../../../../stores/languageStore.js';
  import type {Reservation} from '../../../../../types/reservation.types.js';
  import type {Translations} from '../../../../../types/translations.types.js';
  import {formatTime} from '../../../../../utils/dateUtils.js';

  export let nextReservation: Reservation | null;
  export let closingTime: string | Date | null | undefined;
  export let translations: Translations;

  $: availabilityClass = nextReservation
    ? 'text-metropoliaSupportRed'
    : 'text-metropoliaTrendGreen';

  $: formattedClosingTime = closingTime
    ? typeof closingTime === 'string'
      ? new Date(closingTime)
      : closingTime instanceof Date
        ? closingTime
        : null
    : null;
</script>

<div
  class="flex items-center gap-2 font-body text-sm font-bold {availabilityClass} transition-transform duration-300 hover:scale-105"
  role="status"
>
  <!-- <Clock
    size={nextReservation ? 20 : 30}
    class="animate-pulse"
    color="#3ba88f"
    aria-hidden="true"
  /> -->
  <span class={nextReservation ? 'animate-pulse' : ''}>
    {#if nextReservation}
      {#if $languageStore.isEnglish}
        {translations.en.availableUntil}
        {formatTime(new Date(nextReservation.startDate))}
      {:else}
        {translations.fi.availableUntil.replace(
          '%time%',
          formatTime(new Date(nextReservation.startDate))
        )}
      {/if}
    {:else if formattedClosingTime}
      {$languageStore.isEnglish
        ? `${translations.en.availableUntilClosing} ${formatTime(formattedClosingTime)}`
        : `${translations.fi.availableUntilClosing} ${formatTime(formattedClosingTime)}`}
    {:else}
      {$languageStore.isEnglish
        ? translations.en.availableAllDay
        : translations.fi.availableAllDay}
    {/if}
  </span>
</div>
