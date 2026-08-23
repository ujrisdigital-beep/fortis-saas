import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { matchGrants } from "@/lib/grow/grants";

export async function GET() {
  const access = await requireApiAccess("grow", "read");
  if (!access.ok) return access.response;
  const matches = matchGrants({
    country: "Gambia",
    sectors: ["agriculture", "energy", "saas"],
    asOf: new Date().toISOString(),
  });
  return NextResponse.json({ matches, scoreKind: "editorial_hypothesis" });
}
