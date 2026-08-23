import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { createBooking } from "@/lib/rides/service";

export async function POST(request: Request) {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const result = createBooking({
      renterId: access.session.userId,
      vehicleId: String(body.vehicleId ?? ""),
      days: Number(body.days ?? 1),
      pickup: String(body.pickup ?? ""),
      startDate: String(body.startDate ?? ""),
    });
    return NextResponse.json({
      booking: result.booking,
      transfer: result.transfer,
      next: "Pay the stated amount using the reference, then POST /api/v2/transfers/evidence",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid" }, { status: 400 });
  }
}
