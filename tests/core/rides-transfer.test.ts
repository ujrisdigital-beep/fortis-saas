import { describe, expect, it, beforeEach } from "vitest";
import { createInstruction, platformBeneficiary, submitEvidence, canUseService } from "../../lib/payments/transfer";
import { rideStore } from "../../lib/rides/registry";
import { createBooking, listVehicle, payBookingWithEvidence, publicVehicles, registerOwner } from "../../lib/rides/service";

describe("rides + transfer payments", () => {
  beforeEach(() => rideStore.reset());

  it("lets an owner list and a client book only after matching transfer evidence", () => {
    const owner = registerOwner({ userId: "u-owner", displayName: "Lamin Tours", phone: "2207000000" });
    const vehicle = listVehicle({
      userId: owner.userId,
      make: "Toyota",
      model: "Corolla",
      year: 2018,
      category: "saloon",
      licensePlate: "BJL-101",
      seats: 4,
      dailyRateMinor: 150000,
      location: "Serrekunda",
      withDriver: true,
    });
    expect(publicVehicles()).toHaveLength(1);

    const { booking, transfer } = createBooking({
      renterId: "u-client",
      vehicleId: vehicle.id,
      days: 2,
      pickup: "Airport",
      startDate: "2026-08-24",
    });
    expect(booking.status).toBe("AWAITING_TRANSFER");
    expect(transfer.amountMinor).toBe(300000);
    expect(canUseService(transfer)).toBe(false);

    expect(() =>
      submitEvidence(transfer, {
        reference: "WRONG",
        payerName: "Fatou",
        method: "wave",
        declaredAmountMinor: 300000,
        proofNote: "WAVE-1",
        declaredPaidAt: "2026-08-23",
      }),
    ).toThrow("reference_mismatch");

    const paid = payBookingWithEvidence(transfer.reference, {
      payerName: "Fatou",
      method: "wave",
      declaredAmountMinor: 300000,
      proofNote: "WAVE-99881",
      declaredPaidAt: "2026-08-23",
    });
    expect(paid.status).toBe("PROVISIONAL");
    expect(canUseService(rideStore.transfers.get(transfer.reference)!)).toBe(true);
  });

  it("creates catalogue transfer instructions without claiming card capture", () => {
    const inst = createInstruction({
      module: "grow",
      serviceId: "price_grow_diagnostic_gmd_v1",
      amountMinor: 25000,
      currency: "GMD",
      ...platformBeneficiary(),
    });
    expect(inst.status).toBe("AWAITING_TRANSFER");
    expect(inst.reference.startsWith("FTS-")).toBe(true);
  });
});
