import { NextResponse } from "next/server";
import {
  attemptDeskCheckout,
  getDeskThread,
  openDeskThread,
  postDeskMessage,
  type DeskKind,
} from "@/lib/services/desk";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const row = getDeskThread(id);
  if (!row) return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: "open" | "message" | "checkout";
    id?: string;
    kind?: DeskKind;
    subject?: string;
    text?: string;
    from?: "seeker" | "merchant" | "ops";
  } | null;

  if (body?.action === "checkout") {
    const result = attemptDeskCheckout(body.id ?? "");
    return NextResponse.json(result, { status: 503 });
  }

  try {
    if (body?.action === "message") {
      const row = postDeskMessage(body.id ?? "", body.text ?? "", body.from ?? "seeker");
      return NextResponse.json(row);
    }
    const row = openDeskThread({
      kind: body?.kind ?? "logistics",
      subject: body?.subject ?? "",
      firstMessage: body?.text ?? "",
    });
    return NextResponse.json({ ...row, booked: false, escrow: false }, { status: 201 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid";
    return NextResponse.json({ error: reason }, { status: 400 });
  }
}
