import {writable} from 'svelte/store';

interface UIControls {
  mode: 'map' | 'list' | 'auto' | null;
  showFeedback: boolean;
  autoScroll: boolean;
  scrollSpeed: number;
  scrollInterval: number;
  scrollPause: number;
}

const defaultControls: UIControls = {
  mode: 'auto',
  showFeedback: false,
  autoScroll: false,
  scrollSpeed: 1.3,
  scrollInterval: 50,
  scrollPause: 1000
};

export const uiControlStore = writable<UIControls>(defaultControls);
