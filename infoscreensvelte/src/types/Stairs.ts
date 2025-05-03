export interface Stairs {
  key: string;
  x: number;
  y: number;
  floor: number;
  building: string;
  directionArrow?: 'left' | 'right' | 'up' | 'down';
  arrowLength?: number;
  isEmergencyExit?: boolean;
}
