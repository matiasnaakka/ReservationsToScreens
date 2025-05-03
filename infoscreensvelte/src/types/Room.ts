export interface Room {
  key: string;
  roomNumber?: string;
  x: number;
  y: number;
  floor: number;
  building: string;
  status?: 'free' | 'occupied' | 'reserved';
  directionArrow?: 'left' | 'right' | 'top' | 'bottom';
  arrowLength?: number;
}
