export interface Resource {
  type: 'student_group' | 'room';
  name: string;
  parent?: {
    name: string;
  };
  code: string;
}

export interface Reservation {
  id: string;
  subject: string;
  modifiedDate: string;
  startDate: string;
  endDate: string;
  description: string;
  resources: Resource[];
}

export interface ReservationResponse {
  reservations: Reservation[];
}
