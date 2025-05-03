import {writable} from 'svelte/store';
import type {Room} from '../types/Room';

// This can be customized locally
const defaultRoomCoords: Room[] = [
  {
    key: 'KMC251',
    x: -6,
    y: -5,
    floor: 5, // actually in 2nd floor
    building: 'KM'
  },
  {
    key: 'KME572',
    x: -0.4,
    y: -6.3,
    floor: 5,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1.1
  },
  {
    key: 'KMC551 ',
    x: -6,
    y: -1,
    floor: 5,
    building: 'KM',
    directionArrow: 'top',
    arrowLength: 1.1
  },
  {
    key: 'KMD550',
    x: 7,
    y: 3,
    floor: 5,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1.1
  },
  {
    key: 'KMD569',
    x: 2,
    y: 7,
    floor: 5,
    building: 'KM',
    directionArrow: 'bottom',
    arrowLength: 1.1
  },
  {
    key: 'KME551',
    x: 5,
    y: -5,
    floor: 5,
    building: 'KM',
    directionArrow: 'bottom',
    arrowLength: 1
  },
  {
    key: 'KME559',
    x: 8.5,
    y: -4.5,
    floor: 5,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME561',
    x: 7,
    y: -3,
    floor: 5,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME562',
    x: 5.5,
    y: -2,
    floor: 5,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME590',
    x: 5.5,
    y: 0,
    floor: 5,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD653',
    x: 3.5,
    y: 2,
    floor: 6,
    building: 'KM',
    directionArrow: 'top',
    arrowLength: 0.5
  },
  {
    key: 'KMD654',
    x: 6,
    y: 3.7,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD650',
    x: 2,
    y: 0.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1
  },
  {
    key: 'KMD651',
    x: 7,
    y: 1,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 2
  },
  {
    key: 'KMD652',
    x: 8.5,
    y: 2.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 2.4
  },
  {
    key: 'KMD657',
    x: 8.5,
    y: 4.7,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 2
  },
  {
    key: 'KMD659',
    x: -0.7,
    y: 4.7,
    floor: 6,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 2
  },
  {
    key: 'KME654',
    x: 6,
    y: -5.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME655',
    x: 3.4,
    y: -3.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'bottom',
    arrowLength: 1
  },
  {
    key: 'KME656',
    x: 1.1,
    y: -4.7,
    floor: 6,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1
  },
  {
    key: 'KME659',
    x: 8.5,
    y: -4.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME661',
    x: 6.8,
    y: -3,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME651',
    x: 6,
    y: -7.9,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME690',
    x: 5.5,
    y: -0.5,
    floor: 6,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD750',
    x: 6,
    y: 1.5,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD751',
    x: 7.5,
    y: 3,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD757',
    x: 8,
    y: 5,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD758',
    x: 6,
    y: 7,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KMD759',
    x: -0.1,
    y: 5,
    floor: 7,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1
  },
  {
    key: 'KME772',
    x: 1,
    y: -5.5,
    floor: 7,
    building: 'KM',
    arrowLength: 1
  },
  {
    key: 'KME773',
    x: -0.6,
    y: -7.0,
    floor: 7,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1
  },
  {
    key: 'KME790',
    x: 5.5,
    y: -0.5,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME751',
    x: 7.7,
    y: -7,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 2
  },
  {
    key: 'KME752',
    x: 4.5,
    y: -8,
    floor: 7,
    building: 'KM',
    directionArrow: 'top',
    arrowLength: 1.5
  },
  {
    key: 'KME753',
    x: 6.2,
    y: -5.5,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1.5
  },
  {
    key: 'KME754',
    x: 3.5,
    y: -3.2,
    floor: 7,
    building: 'KM',
    directionArrow: 'bottom',
    arrowLength: 1
  },
  {
    key: 'KME759',
    x: 9,
    y: -4.5,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME761',
    x: 7.1,
    y: -3,
    floor: 7,
    building: 'KM',
    directionArrow: 'left',
    arrowLength: 1
  },
  {
    key: 'KME762',
    x: 2,
    y: -2,
    floor: 7,
    building: 'KM',
    directionArrow: 'right',
    arrowLength: 1
  }
];

export const roomCoordsStore = writable<Room[]>(defaultRoomCoords);
