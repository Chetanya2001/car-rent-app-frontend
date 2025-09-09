export interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  image: string | null;
}
export interface CarFormData {
  make?: string;
  model?: string;
  yearOfMake?: string;
  ownerName?: string;
  registrationNo?: string;
  cityOfRegistration?: string;
  rcValidTill?: string;
  rcFile?: File;
  insuranceCompany?: string;
  insuranceIdv?: number;
  insuranceValidTill?: string;
  insuranceFile?: File;
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
  hourlyRent?: number;
  availableFrom?: string;
  availableTill?: string;
}
