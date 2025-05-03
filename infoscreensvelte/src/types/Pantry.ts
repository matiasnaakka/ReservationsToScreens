export interface Pantry {
  key: string;
  x: number;
  y: number;
  floor: number;
  building: string;
  directionArrow?: 'left' | 'right' | 'up' | 'down';
  arrowLength?: number;
  hasCoffee?: boolean;
  coffeeMachine?: 'pro' | 'basic' | 'vending' | null;
  diningAccess?: 'all' | 'employees' | 'students';
}
