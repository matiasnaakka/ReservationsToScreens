export type DayHours = {
  hours: number | null;
  minutes: number | null;
  closeHours: number | null;
  closeMinutes: number | null;
  isClosed: boolean;
};

export type WeekHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

export type Campus = {
  name: string;
  shorthand: string;
  hours: WeekHours;
};

export type BusinessHours = {
  campuses: Campus[];
};
