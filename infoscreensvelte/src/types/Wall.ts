export interface WallDefinition {
  start: [number, number];
  end: [number, number];
  thickness?: number;
}

export interface BuildingFloorWalls {
  building: string;
  floor: number;
  walls: WallDefinition[];
}
