export interface Reservation {
    id: string;
    subject: string;
    description: string;
    startDate: string;
    endDate: string;
    modifiedDate: string;
    resources: any[];
}

export interface FreeSpaceData {
    building: string;
    roomNumber: string;
    floor: string;
    wing: string;
    details: string;
    persons: string;
    squareMeters: string;
    reservableStaff: string;
    reservableStudents: string;
    reserved: boolean;
    freeUntil: string;
    currentReservation: Reservation | null;
    nextReservation: Reservation | null;
}
