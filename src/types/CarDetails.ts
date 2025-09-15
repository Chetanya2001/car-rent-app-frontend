export interface CarFeatures {
  length: number;
  slice(arg0: number, arg1: number): unknown;
  airconditions: boolean;
  child_seat: boolean;
  gps: boolean;
  luggage: boolean;
  music: boolean;
  seat_belt: boolean;
  sleeping_bed: boolean;
  water: boolean;
  bluetooth: boolean;
  onboard_computer: boolean;
  audio_input: boolean;
  long_term_trips: boolean;
  car_kit: boolean;
  remote_central_locking: boolean;
  climate_control: boolean;
}

export interface CarPhoto {
  id: number;
  photo_url: string;
}

export interface CarDetailsType {
  price_per_hour: number;
  id: number;
  make: string;
  model: string;
  year: number;
  description: string | null;
  features: CarFeatures;
  photos: CarPhoto[];
}
