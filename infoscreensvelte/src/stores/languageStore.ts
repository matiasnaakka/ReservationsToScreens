import {writable} from 'svelte/store';

interface LanguageState {
  isEnglish: boolean;
  intervalParam: number;
}

export const languageStore = writable<LanguageState>({
  isEnglish: true,
  intervalParam: 15000
});
