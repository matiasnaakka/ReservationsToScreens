import type {Reservation, Resource} from '../types/reservation.types';
export const getNextReservation = (
  roomNumber: string,
  reservations: Reservation[]
): Reservation | null => {
  if (!reservations?.length) return null;
  const now = new Date();
  return (
    reservations
      .filter((res) =>
        res.resources.some((r: Resource) => r.code === roomNumber)
      )
      .filter((res) => new Date(res.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0] || null
  );
};

export const getRoomAvailabilityClass = (
  hasNextReservation: boolean
): string =>
  hasNextReservation
    ? 'text-metropoliaSupportRed'
    : 'text-metropoliaTrendGreen';
