import { NextResponse } from "next/server";
import { getAdminStats } from "../../../../lib/openai-client";

export const dynamic = "force-dynamic";

const SUPER_ADMINS = [
  "ceo@fortisos.gm",
  "admin@fortisos.gm",
  "samba.bajie@fortisos.gm",
  "ujrisdigital@gmail.com",
];

export async function GET(req: Request) {
  // Simple header-based admin check (no auth dependency)
  const adminKey = req.headers.get("x-admin-key");
  const envKey = process.env.ADMIN_SECRET_KEY;

  if (!envKey || adminKey !== envKey) {
    // Also allow by email query param for dashboard use
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email || !SUPER_ADMINS.includes(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Failed to get stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
