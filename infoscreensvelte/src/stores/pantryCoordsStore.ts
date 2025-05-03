import {writable} from 'svelte/store';
import type {Pantry} from '../types/Pantry';

const defaultPantryCoords: Pantry[] = [
  {
    key: 'KM5-P1',
    x: 1.9,
    y: -0.3,
    floor: 5,
    building: 'KM'
  },
  {
    key: 'KM6-P1',
    x: 1.9,
    y: -0.5,
    floor: 6,
    building: 'KM'
  },
  {
    key: 'KM7-P1',
    x: 1.9,
    y: -0.5,
    floor: 7,
    building: 'KM'
  }
];

export const pantryCoordsStore = writable<Pantry[]>(defaultPantryCoords);
