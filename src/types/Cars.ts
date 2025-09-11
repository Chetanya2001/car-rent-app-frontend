export interface Car {
  photos: boolean;
  id: number;
  name: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  image: string | null;
}
export interface CarFormData {
  make?: string;
  model?: string;
  year?: number;
  ownerName?: string;
  registrationNo?: string;
  cityOfRegistration?: string;
  rcValidTill?: string;
  rcFrontFile?: File;
  rcBackFile?: File;
  insurance_company?: string;
  insurance_idv_value?: number;
  insurance_valid_till?: string;
  insurance_image?: File;
  fastTag?: boolean;
  airconditions?: boolean;
  seater?: number;
  fuelType?: string;
  gps?: boolean;
  geofencing?: boolean;
  antiTheft?: boolean;
  child_seat?: boolean;
  luggage?: boolean;
  music?: boolean;
  seat_belt?: boolean;
  sleeping_bed?: boolean;
  water?: boolean;
  bluetooth?: boolean;
  onboard_computer?: boolean;
  audio_input?: boolean;
  long_term_trips?: boolean;
  car_kit?: boolean;
  remote_central_locking?: boolean;
  climate_control?: boolean;
  images?: File[];
  expectedHourlyRent?: number;
  availabilityFrom?: string;
  availabilityTill?: string;
}
export interface AddCarApiResponse {
  make: string;
  model: string;
  year: number;
}
export interface CarFeatures {
  car_id: number;
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
