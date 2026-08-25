import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { listVehicle, publicVehicles } from "@/lib/rides/service";

export async function GET() {
  return NextResponse.json({
    vehicles: publicVehicles(),
    liveEscrow: false,
    notice: "Listings are owner-declared. Pay by bank/wallet transfer with evidence.",
  });
}

export async function POST(request: Request) {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const vehicle = listVehicle({
      userId: access.session.userId,
      make: String(body.make ?? ""),
      model: String(body.model ?? ""),
      year: Number(body.year ?? 2018),
      category: String(body.category ?? "saloon"),
      licensePlate: String(body.licensePlate ?? ""),
      seats: Number(body.seats ?? 4),
      dailyRateMinor: Number(body.dailyRateMinor ?? 0),
      location: String(body.location ?? ""),
      withDriver: Boolean(body.withDriver),
    });
    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid" }, { status: 400 });
  }
}
