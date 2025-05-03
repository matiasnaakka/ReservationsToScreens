import {writable} from 'svelte/store';
import type {Elevator} from '../types/Elevator';

const defaultElevatorCoords: Elevator[] = [
  {
    key: 'KM-E1',
    x: 2.2,
    y: 1.8,
    floor: 5,
    building: 'KM'
  },
  {
    key: 'KM-E2',
    x: 2.2,
    y: 1.8,
    floor: 6,
    building: 'KM'
  },
  {
    key: 'KM-E3',
    x: 2.2,
    y: 1.8,
    floor: 7,
    building: 'KM'
  }
];

export const elevatorCoordsStore = writable<Elevator[]>(defaultElevatorCoords);
