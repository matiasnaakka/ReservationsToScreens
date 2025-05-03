import type {Reservation} from './reservation.types.js';

export interface Room {
  roomNumber: string;
  wing: string;
  floor: string;
  persons: string;
  squareMeters: string;
  details: string;
  reservableStaff: string;
  reservableStudents: string;
  floorColorCode: string;
  closingTime?: string | Date | null;
  nextReservation?: Reservation | null;
  currentReservation?: Reservation | null;
}

export interface RoomPermissionsProps {
  reservableStaff: string;
  reservableStudents: string;
}

export interface RoomAvailabilityInfo {
  nextReservation: Reservation | null;
  closingTime?: string | Date | null;
}

export interface RoomCardProps extends Room {
  reservations: Reservation[];
}

export interface FreeSpaceParams {
  floor?: string;
  building?: string;
  wing?: string;
  persons?: string;
  squareMeters?: string;
  details?: string;
  reservableStudents?: boolean;
  reservableStaff?: boolean;
  startDate: string;
  endDate: string;
}
