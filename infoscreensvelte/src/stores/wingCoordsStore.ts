import {writable} from 'svelte/store';

interface WingCoords {
  letter: string;
  x: number;
  y: number;
}

type BuildingWings = Record<string, WingCoords[]>;

const defaultWingCoords: BuildingWings = {
  KM: [
    {letter: 'C', x: -1, y: 7},
    {letter: 'D', x: 8, y: 7},
    {letter: 'E', x: 8, y: -6}
  ]
  // Add other buildings as needed
  // TX: [
  //   {letter: 'A', x: -3, y: 0},
  //   {letter: 'B', x: 3, y: 0}
  // ]
};

export const wingCoordsStore = writable<BuildingWings>(defaultWingCoords);
