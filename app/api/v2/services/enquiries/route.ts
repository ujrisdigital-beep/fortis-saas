import { NextResponse } from "next/server";
import { openServiceEnquiry, type ServiceKind } from "@/lib/services/enquiries";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    kind?: ServiceKind;
    name?: string;
    phone?: string;
    note?: string;
    consent?: boolean;
  } | null;
  try {
    const enquiry = openServiceEnquiry({
      kind: body?.kind ?? "professionals",
      name: body?.name ?? "",
      phone: body?.phone ?? "",
      note: body?.note ?? "",
      consent: Boolean(body?.consent),
    });
    return NextResponse.json(
      {
        id: enquiry.id,
        status: enquiry.status,
        booked: false,
        message: "Enquiry received. No booking, hire or carrier quote has been confirmed.",
      },
      { status: 201 },
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid";
    return NextResponse.json({ error: reason, code: "INVALID_INPUT" }, { status: 400 });
  }
}
