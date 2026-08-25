import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { registerOwner } from "@/lib/rides/service";

export async function POST(request: Request) {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => null)) as { displayName?: string; phone?: string } | null;
  try {
    const owner = registerOwner({
      userId: access.session.userId,
      displayName: body?.displayName ?? "",
      phone: body?.phone ?? "",
    });
    return NextResponse.json({ owner });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid" }, { status: 400 });
  }
}
