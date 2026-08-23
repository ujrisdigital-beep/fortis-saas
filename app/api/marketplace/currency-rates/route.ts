import { NextResponse } from "next/server";
import { fetchOpenUsdRates } from "@/lib/core/data/fetchers/open-fx";

export const dynamic = "force-dynamic";

export async function GET() {
  const fx = await fetchOpenUsdRates();
  if (!fx.ok) {
    return NextResponse.json({ success: false, notice: fx.notice, live: false }, { status: 503 });
  }
  return NextResponse.json({
    success: true,
    live: true,
    notOfficialCbg: true,
    ...fx,
  });
}
