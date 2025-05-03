export interface Toilet {
  key: string;
  x: number;
  y: number;
  floor: number;
  building: string;
  type: 'M' | 'F' | 'U'; // M = Male, F = Female, U = Unisex (both), handicap accessible
  directionArrow?: 'left' | 'right' | 'up' | 'down';
  arrowLength?: number;
  isHandicapAccessible?: boolean;
}
