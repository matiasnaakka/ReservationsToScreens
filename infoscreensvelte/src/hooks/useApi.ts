import {writable} from 'svelte/store';
import {doFetch} from '../utils/doFetch.js';
import type {ReservationResponse} from '../types/reservation.types.js';
import type {Room} from '../types/room.types.js';
import type {FreeSpaceResponse} from '../types/api.types';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface EnrichedRoom extends Room {
  reserved: boolean;
  rooms: Room[];
  metadata: Record<string, string>;
  reservationDetails: ReservationResponse['reservations'][0] | null;
}

export function createApiStore<T>() {
  const store = writable<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false
  });

  return store;
}

interface FreeSpaceParams {
  floor?: string;
  building?: string;
  startDate?: string;
  endDate?: string;
  reservableStudents?: string;
  reservableStaff?: string;
  details?: string;
  groupDetails?: string;
}

export async function fetchFreeSpace(params: FreeSpaceParams) {
  try {
    const queryParams = new URLSearchParams();

    // Add all params that are defined
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await doFetch<FreeSpaceResponse>(
      `api/rooms/freespace?${queryParams.toString()}`
    );

    return response;
  } catch (error) {
    const apiError =
      error instanceof ApiError ? error : new Error('Unknown error occurred');
    throw apiError;
  }
}
