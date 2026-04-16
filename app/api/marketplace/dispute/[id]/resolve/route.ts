import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { resolution, refundAmount, notes } = body;
  const { id } = params;

  if (!resolution) {
    return NextResponse.json({ error: "resolution is required: 'refund_buyer' | 'release_seller' | 'partial_refund'" }, { status: 400 });
  }

  const result = {
    disputeId: id,
    resolution,
    refundAmount: refundAmount ?? 0,
    notes,
    resolvedAt: new Date().toISOString(),
    status: "resolved",
    message:
      resolution === "refund_buyer"
        ? "Full refund issued to buyer. Seller deposit reviewed."
        : resolution === "partial_refund"
        ? `Partial refund of GMD ${refundAmount} issued to buyer. Remainder released to seller.`
        : "Funds released to seller. Dispute closed.",
  };

  return NextResponse.json(result);
}
