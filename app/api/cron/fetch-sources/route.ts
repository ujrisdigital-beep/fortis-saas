// app/api/cron/fetch-sources/route.ts
// Vercel cron job — runs daily at 06:00 UTC
import { NextResponse } from "next/server";
import { fetchAllActiveSources } from "../../../../lib/data-source-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await fetchAllActiveSources();
    const totalFetched = results.reduce((s, r) => s + r.fetched, 0);
    const totalNew = results.reduce((s, r) => s + r.new, 0);
    const errors = results.flatMap(r => r.errors.map(e => `${r.name}: ${e}`));

    return NextResponse.json({
      ok: true,
      ran: new Date().toISOString(),
      sources: results.length,
      totalFetched,
      totalNew,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
