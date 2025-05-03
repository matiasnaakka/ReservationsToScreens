import { writable } from 'svelte/store';
import type { Room } from '../types/room.types';
import type { ApiMetadata } from '../types/api.types';

/**
 * The `freeSpaceStore` is responsible for managing the free space data of the application.
 * It contains the following properties:
 * - `loading`: A boolean indicating whether the data is being loaded.
 * - `error`: An error object or null if there is no error.
 * - `data`: An array of free space data or null if there is no data.
 * - `metadata`: An object containing metadata about the floors and buildings.
 */

interface FreeSpaceState {
	data: Room[] | null;
	error: Error | null;
	loading: boolean;
	metadata: ApiMetadata;
}

const initialState: FreeSpaceState = {
	data: null,
	error: null,
	loading: false,
	metadata: {
		floors: [],
		buildings: []
	}
};

export const freeSpaceStore = writable<FreeSpaceState>(initialState);
