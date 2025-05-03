export type TranslationDetails = Record<string, string>;

export interface Translation {
  floor: string;
  wing: string;
  person: string;
  persons: string;
  squareMeters: string;
  roomImageAlt: string;
  openFullScreenImage: string;
  qrTitle: string;
  qrAlt: string;
  availableUntil: string;
  availableAllDay: string;
  availableUntilClosing: string;
  staff: string;
  students: string;
  // Control translations
  selectFloor: string;
  allFloors: string;
  selectBuilding: string;
  allBuildings: string;
  viewMode: string;
  automatic: string;
  mapView: string;
  listView: string;
  showFeedback: string;
  hideFeedback: string;
  startAutoScroll: string;
  stopAutoScroll: string;
  // URL Builder translation
  urlBuilder: string;
  details: Record<string, string>;
}

export interface Translations {
  en: Translation;
  fi: Translation;
}
