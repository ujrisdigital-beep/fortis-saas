import { NextRequest, NextResponse } from "next/server";

const DEMO_REVIEWS = [
  { id: "r1", productId: "p1", sellerId: "s1", buyerName: "Aminata K.", rating: 5, comment: "Beautiful fabric, exactly as described. Fast delivery!", date: "2026-03-15", verified: true, sellerReply: null, helpful: 8 },
  { id: "r2", productId: "p2", sellerId: "s2", buyerName: "Ibrahim J.", rating: 5, comment: "Best shea butter I've ever bought. My skin feels amazing.", date: "2026-04-01", verified: true, sellerReply: "Thank you so much! We're glad you love it.", helpful: 15 },
  { id: "r3", productId: "p1", sellerId: "s1", buyerName: "Mariama D.", rating: 4, comment: "Good quality but slightly different shade than photo. Still happy.", date: "2026-03-28", verified: true, sellerReply: null, helpful: 3 },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const sellerId = searchParams.get("sellerId");

  let reviews = DEMO_REVIEWS;
  if (productId) reviews = reviews.filter((r) => r.productId === productId);
  if (sellerId) reviews = reviews.filter((r) => r.sellerId === sellerId);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return NextResponse.json({ reviews, average: Math.round(avg * 100) / 100, distribution: dist, total: reviews.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, buyerName, rating, comment } = body;

  if (!productId || !rating || !comment || !buyerName) {
    return NextResponse.json({ error: "productId, buyerName, rating, and comment required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
  }

  const review = {
    id: `r${Date.now()}`,
    productId, buyerName, rating, comment,
    date: new Date().toISOString().slice(0, 10),
    verified: true, sellerReply: null, helpful: 0,
  };

  return NextResponse.json({ review, message: "Review submitted successfully" }, { status: 201 });
}
