import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { canUseService, submitEvidence, type TransferMethod } from "@/lib/payments/transfer";
import { rideStore } from "@/lib/rides/registry";
import { payBookingWithEvidence } from "@/lib/rides/service";

export async function POST(request: Request) {
  const access = await requireApiAccess("billing", "read");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => ({}))) as {
    reference?: string;
    payerName?: string;
    method?: TransferMethod;
    declaredAmountMinor?: number;
    proofNote?: string;
    declaredPaidAt?: string;
  };
  const reference = body.reference ?? "";
  const instruction = rideStore.transfers.get(reference);
  if (!instruction) {
    return NextResponse.json({ error: "unknown_reference", code: "NOT_FOUND" }, { status: 404 });
  }
  const evidence = {
    payerName: body.payerName ?? "",
    method: body.method ?? "bank" as TransferMethod,
    declaredAmountMinor: Number(body.declaredAmountMinor ?? 0),
    proofNote: body.proofNote ?? "",
    declaredPaidAt: body.declaredPaidAt ?? new Date().toISOString(),
  };
  try {
    const hasBooking = [...rideStore.bookings.values()].some((b) => b.transferReference === reference);
    if (hasBooking) {
      const booking = payBookingWithEvidence(reference, evidence);
      const updated = rideStore.transfers.get(reference)!;
      return NextResponse.json({
        status: updated.status,
        canUseService: canUseService(updated),
        booking,
        notice: "Provisional ride access after declared transfer. Not a card capture.",
      });
    }
    const result = submitEvidence(instruction, { ...evidence, reference });
    rideStore.transfers.set(reference, result.instruction);
    return NextResponse.json({
      status: result.instruction.status,
      canUseService: canUseService(result.instruction),
      booking: null,
      notice: "Provisional access after declared transfer. Operator may revoke if the credit does not arrive.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid" }, { status: 400 });
  }
}
