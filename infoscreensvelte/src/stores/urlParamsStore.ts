import {writable} from 'svelte/store';

export interface URLParams {
  x: number;
  y: number;
  floor: string | null;
  building: string | null;
  mode: 'map' | 'list' | 'auto' | null;
  showFeedback: boolean;
  autoScroll: boolean;
  scrollSpeed: number;
  scrollInterval: number;
  scrollPause: number;
  translationInterval: number;
  updateInterval: number;
  specificDate: string | null;
  reservableType: 'all' | 'staff' | 'students';
  showReservations: boolean;
}

const createUrlParamsStore = () => {
  const defaultParams: URLParams = {
    x: 3,
    y: 6.4,
    floor: null,
    building: null,
    mode: 'auto',
    showFeedback: false,
    autoScroll: false,
    scrollSpeed: 1,
    scrollInterval: 50,
    scrollPause: 1000,
    translationInterval: 15000,
    updateInterval: 300000,
    specificDate: null,
    reservableType: 'all',
    showReservations: false
  };

  const {subscribe, set, update} = writable<URLParams>(defaultParams);

  const initializeFromURL = (searchParams: URLSearchParams) => {
    const params: URLParams = {
      x: Number(searchParams.get('x')) || defaultParams.x,
      y: Number(searchParams.get('y')) || defaultParams.y,
      floor: searchParams.get('floor'),
      building: searchParams.get('building'),
      mode:
        (searchParams.get('mode') as URLParams['mode']) || defaultParams.mode,
      showFeedback: searchParams.get('showFeedback') === 'true',
      autoScroll: searchParams.get('autoScroll') === 'true',
      scrollSpeed:
        Number(searchParams.get('scrollSpeed')) || defaultParams.scrollSpeed,
      scrollInterval:
        Number(searchParams.get('scrollInterval')) ||
        defaultParams.scrollInterval,
      scrollPause:
        Number(searchParams.get('scrollPause')) || defaultParams.scrollPause,
      translationInterval:
        Number(searchParams.get('translationInterval')) ||
        defaultParams.translationInterval,
      updateInterval:
        Number(searchParams.get('updateInterval')) ||
        defaultParams.updateInterval,
      specificDate: searchParams.get('specificdate'),
      reservableType:
        (searchParams.get('reservable') as URLParams['reservableType']) ||
        defaultParams.reservableType,
      showReservations: searchParams.get('showReservations') === 'true'
    };
    set(params);
  };

  return {
    subscribe,
    set,
    update,
    initializeFromURL
  };
};

export const urlParamsStore = createUrlParamsStore();
