import { NextRequest, NextResponse } from "next/server";

const DISPUTES: Record<string, object> = {};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, buyerName, buyerPhone, reason, description, amount } = body;

  if (!orderId || !reason || !description) {
    return NextResponse.json({ error: "orderId, reason, and description are required" }, { status: 400 });
  }

  const disputeId = `DIS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const dispute = {
    id: disputeId,
    orderId, buyerName, buyerPhone, reason, description, amount,
    status: "open",
    aiRecommendation: null,
    adminReview: amount > 5000,
    evidence: [],
    timeline: [
      { event: "Dispute filed", timestamp: new Date().toISOString(), actor: "buyer" },
    ],
    slaDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  DISPUTES[disputeId] = dispute;

  return NextResponse.json({
    dispute,
    message: "Dispute filed. UJRIS AI will analyze evidence within 24 hours. Resolution within 72 hours guaranteed.",
  }, { status: 201 });
}
