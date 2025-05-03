import type {Room} from './room.types';

export interface ApiMetadata {
  floors: string[];
  buildings: string[];
}

export interface FreeSpaceResponse {
  rooms: Room[];
  metadata: ApiMetadata;
}
