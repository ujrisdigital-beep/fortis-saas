import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { businessName, ownerName, phone, email, paymentMethod, paymentReference } = body;

  if (!businessName || !ownerName || !phone || !paymentMethod) {
    return NextResponse.json({ error: "businessName, ownerName, phone, paymentMethod required" }, { status: 400 });
  }

  const depositId = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const deposit = {
    id: depositId,
    amount: 500,
    currency: "GMD",
    status: "pending_verification",
    businessName,
    ownerName,
    phone,
    email,
    paymentMethod,
    paymentReference,
    escrowConditions: {
      releaseAfterSales: 10,
      minimumRating: 4.5,
      minimumDays: 30,
    },
    forfeitConditions: ["Valid buyer complaint upheld", "Fraudulent activity proven", "Account banned"],
    createdAt: new Date().toISOString(),
    message: "Deposit registered. We will verify within 24 hours and activate your seller account.",
  };

  return NextResponse.json({ deposit }, { status: 201 });
}
