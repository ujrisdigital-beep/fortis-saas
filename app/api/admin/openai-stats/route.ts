import { NextResponse } from "next/server";
import { getAdminStats } from "../../../../lib/openai-client";
import { requireApiAccess } from "@/lib/core/api-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await requireApiAccess("admin", "admin", { stepUp: true });
  if (!access.ok) return access.response;

  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Failed to get stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
