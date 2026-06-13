export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type TripStatus =
  | 'IDLE'
  | 'REQUESTING'
  | 'MATCHING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface TripState {
  tripId: string;
  status: TripStatus;
  riderId: string;
  driverId: string | null;
  pickup: Location | null;
  dropoff: Location | null;
  driverLocation: Location | null;
  route: [number, number][]; // Array of [lat, lng] for routing line
  price: number;
  timestamp: number;
}

export interface TripHistoryRecord {
  id: string;
  tripId: string;
  riderId: string;
  driverId: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  status: 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  durationMinutes: number;
  timestamp: string;
}

export type UserRole = 'RIDER' | 'DRIVER' | 'SPLIT_SCREEN';
