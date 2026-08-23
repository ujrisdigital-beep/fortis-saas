import { createInstruction, platformBeneficiary, submitEvidence, type TransferEvidence } from "../payments/transfer";
import { rideStore, type RideBooking, type RideOwner, type RideVehicle } from "./registry";

export function registerOwner(input: { userId: string; displayName: string; phone: string }): RideOwner {
  const existing = [...rideStore.owners.values()].find((o) => o.userId === input.userId);
  if (existing) return existing;
  if (!input.displayName.trim() || !input.phone.trim()) throw new Error("incomplete_owner");
  const owner: RideOwner = {
    id: `own_${input.userId}`,
    userId: input.userId,
    displayName: input.displayName.trim(),
    phone: input.phone.trim(),
    createdAt: new Date().toISOString(),
  };
  rideStore.owners.set(owner.id, owner);
  return owner;
}

export function listVehicle(input: {
  userId: string;
  make: string;
  model: string;
  year: number;
  category: string;
  licensePlate: string;
  seats: number;
  dailyRateMinor: number;
  location: string;
  withDriver: boolean;
}): RideVehicle {
  const owner = [...rideStore.owners.values()].find((o) => o.userId === input.userId);
  if (!owner) throw new Error("owner_required");
  if (input.dailyRateMinor <= 0) throw new Error("invalid_rate");
  const vehicle: RideVehicle = {
    id: `veh_${input.licensePlate.replace(/\s+/g, "")}`,
    ownerId: owner.id,
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year,
    category: input.category,
    licensePlate: input.licensePlate.trim().toUpperCase(),
    seats: input.seats,
    dailyRateMinor: input.dailyRateMinor,
    currency: "GMD",
    location: input.location.trim(),
    withDriver: input.withDriver,
    status: "LISTED",
  };
  rideStore.vehicles.set(vehicle.id, vehicle);
  return vehicle;
}

export function publicVehicles(): RideVehicle[] {
  return [...rideStore.vehicles.values()];
}

export function createBooking(input: {
  renterId: string;
  vehicleId: string;
  days: number;
  pickup: string;
  startDate: string;
}): { booking: RideBooking; transfer: ReturnType<typeof createInstruction> } {
  const vehicle = rideStore.vehicles.get(input.vehicleId);
  if (!vehicle) throw new Error("vehicle_not_found");
  if (input.days < 1) throw new Error("invalid_days");
  const amountMinor = vehicle.dailyRateMinor * input.days;
  const payee = platformBeneficiary();
  const transfer = createInstruction({
    module: "rides",
    serviceId: vehicle.id,
    organisationHint: input.renterId,
    amountMinor,
    currency: vehicle.currency,
    ...payee,
  });
  const booking: RideBooking = {
    id: `bk_${transfer.reference}`,
    renterId: input.renterId,
    vehicleId: vehicle.id,
    days: input.days,
    amountMinor,
    currency: vehicle.currency,
    transferReference: transfer.reference,
    status: "AWAITING_TRANSFER",
    pickup: input.pickup,
    startDate: input.startDate,
    createdAt: new Date().toISOString(),
  };
  rideStore.bookings.set(booking.id, booking);
  rideStore.transfers.set(transfer.reference, transfer);
  return { booking, transfer };
}

export function payBookingWithEvidence(
  reference: string,
  evidence: Omit<TransferEvidence, "submittedAt" | "reference"> & { reference?: string },
): RideBooking {
  const transfer = rideStore.transfers.get(reference);
  const booking = [...rideStore.bookings.values()].find((b) => b.transferReference === reference);
  if (!transfer || !booking) throw new Error("unknown_reference");
  const result = submitEvidence(transfer, { ...evidence, reference });
  rideStore.transfers.set(reference, result.instruction);
  booking.status = "PROVISIONAL";
  rideStore.bookings.set(booking.id, booking);
  return booking;
}
