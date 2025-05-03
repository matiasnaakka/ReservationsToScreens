import {writable} from 'svelte/store';
import type {Toilet} from '../types/Toilet';

const defaultToiletCoords: Toilet[] = [
  {
    key: 'KM5-EAST-M',
    x: 3.9,
    y: 4.4,
    floor: 5,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM5-EAST-F',
    x: 4.4,
    y: 5,
    floor: 5,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM6-EAST-M',
    x: 3.9,
    y: 4.4,
    floor: 6,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM6-EAST-F',
    x: 4.4,
    y: 5,
    floor: 6,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM5-WEST-M',
    x: -3.4,
    y: 1.5,
    floor: 5,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM5-WEST-F',
    x: -4,
    y: 1.1,
    floor: 5,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM7-EAST-M',
    x: 3.9,
    y: 4.4,
    floor: 7,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM6-EAST-U-HC',
    x: 4.5,
    y: 4.2,
    floor: 6,
    building: 'KM',
    type: 'U',
    isHandicapAccessible: true
  },
  {
    key: 'KM7-EAST-F',
    x: 4.4,
    y: 5,
    floor: 7,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM5-SOUTH-M',
    x: 2.8,
    y: -6.2,
    floor: 5,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM5-SOUTH-F',
    x: 3.7,
    y: -6.2,
    floor: 5,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM6-SOUTH-M',
    x: 2.8,
    y: -6.2,
    floor: 6,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM6-SOUTH-F',
    x: 3.7,
    y: -6.2,
    floor: 6,
    building: 'KM',
    type: 'F'
  },
  {
    key: 'KM7-SOUTH-M',
    x: 2.8,
    y: -6.2,
    floor: 7,
    building: 'KM',
    type: 'M'
  },
  {
    key: 'KM7-SOUTH-F',
    x: 3.7,
    y: -6.2,
    floor: 7,
    building: 'KM',
    type: 'F'
  }
];

export const toiletCoordsStore = writable<Toilet[]>(defaultToiletCoords);
