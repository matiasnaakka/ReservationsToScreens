// Function to check if the room is currently reserved
export const isRoomReserved = (room) => {
  const now = new Date(); // Hanki nykyhetki

  // Tarkista, onko nykyinen varaus voimassa
  if (room.currentReservation) {
    const currentStart = new Date(room.currentReservation.startDate);
    const currentEnd = new Date(room.currentReservation.endDate);
    if (now >= currentStart && now < currentEnd) {
      return true;
    }
  }

  // Tarkista, onko seuraava varaus alkanut, mutta sitä ei ole siirretty currentReservationiin
  if (room.nextReservation) {
    const nextStart = new Date(room.nextReservation.startDate);
    const nextEnd = new Date(room.nextReservation.endDate);

    if (now >= nextStart && now < nextEnd) {
      return true; // Tämä varaus on jo alkanut
    }
  }

  return false; // Huone on vapaa
};