import {writable} from 'svelte/store';
import type {Stairs} from '../types/Stairs';

const defaultStairsCoords: Stairs[] = [
  {
    key: 'KM5-S1',
    x: 2,
    y: 3.5,
    floor: 5,
    building: 'KM',
    isEmergencyExit: true
  },
  {
    key: 'KM5-S2',
    x: 2.0,
    y: -7.6,
    floor: 5,
    building: 'KM',
    isEmergencyExit: true
  },
  {
    key: 'KM5-S1',
    x: 2,
    y: 3.5,
    floor: 6,
    building: 'KM',
    isEmergencyExit: true
  },
  {
    key: 'KM5-S2',
    x: 2.0,
    y: -7.6,
    floor: 6,
    building: 'KM',
    isEmergencyExit: true
  },
  {
    key: 'KM5-S1',
    x: 2,
    y: 3.5,
    floor: 7,
    building: 'KM',
    isEmergencyExit: true
  },
  {
    key: 'KM5-S2',
    x: 2.0,
    y: -7.6,
    floor: 7,
    building: 'KM',
    isEmergencyExit: true
  }
];

export const stairsCoordsStore = writable<Stairs[]>(defaultStairsCoords);
