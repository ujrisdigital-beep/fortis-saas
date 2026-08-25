import type { TransferInstruction } from "../payments/transfer";

export interface RideOwner {
  id: string;
  userId: string;
  displayName: string;
  phone: string;
  createdAt: string;
}

export interface RideVehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  category: string;
  licensePlate: string;
  seats: number;
  dailyRateMinor: number;
  currency: string;
  location: string;
  withDriver: boolean;
  status: "LISTED";
}

export interface RideBooking {
  id: string;
  renterId: string;
  vehicleId: string;
  days: number;
  amountMinor: number;
  currency: string;
  transferReference: string;
  status: "AWAITING_TRANSFER" | "PROVISIONAL";
  pickup: string;
  startDate: string;
  createdAt: string;
}

const owners = new Map<string, RideOwner>();
const vehicles = new Map<string, RideVehicle>();
const bookings = new Map<string, RideBooking>();
const transfers = new Map<string, TransferInstruction>();

export const rideStore = {
  owners,
  vehicles,
  bookings,
  transfers,
  reset() {
    owners.clear();
    vehicles.clear();
    bookings.clear();
    transfers.clear();
  },
};
