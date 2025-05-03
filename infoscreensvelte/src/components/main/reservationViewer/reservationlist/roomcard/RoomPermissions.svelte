<script lang="ts">
  import {Contact, GraduationCap} from 'lucide-svelte';
  import {languageStore} from '../../../../../stores/languageStore.js';
  import {translations} from '../../../../../translations/translations.js';

  export let reservableStaff: string | undefined = undefined;
  export let reservableStudents: string | undefined = undefined;

  const getColor = (isPermitted: string) =>
    isPermitted === 'true' ? '#3ba88f' : '#cb2228';

  const getTextColorClass = (isPermitted: string) =>
    isPermitted === 'true'
      ? 'text-metropoliaTrendGreen'
      : 'text-metropoliaSupportRed';
</script>

<div
  class="flex flex-col gap-1"
  role="list"
  aria-label={$languageStore.isEnglish
    ? 'Room permissions'
    : 'Huoneen varausoikeudet'}
>
  {#if reservableStaff !== undefined}
    <div class="group relative inline-flex items-center gap-1" role="listitem">
      <Contact size={20} color={getColor(reservableStaff)} aria-hidden="true" />
      <span class={`text-sm ${getTextColorClass(reservableStaff)}`}>
        {$languageStore.isEnglish
          ? translations.en.staff
          : translations.fi.staff}
      </span>
    </div>
  {/if}

  {#if reservableStudents !== undefined && reservableStudents !== 'false'}
    <div class="group relative inline-flex items-center gap-1" role="listitem">
      <GraduationCap
        size={20}
        color={getColor(reservableStudents)}
        aria-hidden="true"
      />
      <span class={`text-sm ${getTextColorClass(reservableStudents)}`}>
        {$languageStore.isEnglish
          ? translations.en.students
          : translations.fi.students}
      </span>
    </div>
  {/if}
</div>
