import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";

export async function POST(req: NextRequest) {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  const body = await req.json();
  const { items, buyerName, buyerPhone, buyerAddress, paymentMethod, currency = "GMD" } = body;

  if (!items?.length || !buyerName || !buyerPhone) {
    return NextResponse.json({ error: "Missing required checkout fields" }, { status: 400 });
  }

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  const commission = Math.round(subtotal * 0.05);
  const total = subtotal;

  const order = {
    id: orderId,
    status: "pending_payment",
    escrowStatus: "holding",
    items,
    buyerName, buyerPhone, buyerAddress,
    paymentMethod: paymentMethod ?? "mobile_money",
    currency,
    subtotal,
    commission,
    total,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    escrowNote: "Funds will be held in escrow until you confirm delivery.",
  };

  return NextResponse.json({ order, message: "Order created — funds held in escrow pending delivery confirmation" }, { status: 201 });
}
