import { NextRequest, NextResponse } from "next/server";

// Cart is managed client-side via localStorage; this endpoint handles server-side cart validation
export async function GET() {
  return NextResponse.json({ items: [], total: 0, message: "Cart managed client-side via localStorage" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, quantity = 1 } = body;
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  return NextResponse.json({ message: "Item added", productId, quantity });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { productId, quantity } = body;
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  if (quantity === 0) return NextResponse.json({ message: "Item removed", productId });
  return NextResponse.json({ message: "Cart updated", productId, quantity });
}
