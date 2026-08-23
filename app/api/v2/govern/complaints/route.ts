import { NextResponse } from "next/server";
import { openComplaint } from "@/lib/govern/complaints";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    body?: string;
    consent?: boolean;
  } | null;
  try {
    const complaint = openComplaint({
      subject: body?.subject ?? "",
      body: body?.body ?? "",
      consent: Boolean(body?.consent),
    });
    return NextResponse.json({
      reference: complaint.reference,
      status: complaint.status,
      message: "Complaint received. No determination has been made.",
    }, { status: 201 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid";
    return NextResponse.json({ error: reason, code: "INVALID_INPUT" }, { status: 400 });
  }
}
