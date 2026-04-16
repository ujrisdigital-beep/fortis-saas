import { NextRequest, NextResponse } from "next/server";

// In-memory demo store (replace with Prisma in production)
const DEMO_PRODUCTS = [
  { id: "p1", name: "Handmade Batik Fabric", price: 500, category: "Fashion & Textiles", seller: "Fatou's Fashion", rating: 4.8, reviews: 24, stock: 15, description: "Authentic Gambian batik fabric, hand-dyed using traditional techniques. 2m x 1.5m. Perfect for clothing and decor.", whatsapp: "2207012345", images: ["/images/products/batik.jpg"], location: "Serrekunda Market", verified: true },
  { id: "p2", name: "Organic Shea Butter", price: 300, category: "Beauty & Health", seller: "Women's Co-op", rating: 4.9, reviews: 67, stock: 50, description: "100% pure unrefined shea butter sourced from the Gambian countryside. No additives. 500g jar.", whatsapp: "2207023456", images: ["/images/products/shea.jpg"], location: "Banjul", verified: true },
  { id: "p3", name: "Fresh Garden Vegetables", price: 200, category: "Food & Agriculture", seller: "Local Farm", rating: 4.7, reviews: 31, stock: 20, description: "Seasonal mixed vegetables from certified organic farms. Tomatoes, peppers, okra, and more. 5kg pack.", whatsapp: "2207034567", images: ["/images/products/veg.jpg"], location: "Brikama", verified: true },
  { id: "p4", name: "Carved Wooden Bowl", price: 1200, category: "Crafts & Art", seller: "Master Craftsman", rating: 4.6, reviews: 12, stock: 8, description: "Hand-carved from Gambian mahogany wood. Unique grain patterns. Diameter 30cm.", whatsapp: "2207045678", images: ["/images/products/bowl.jpg"], location: "Banjul Old Town", verified: true },
  { id: "p5", name: "Solar Phone Charger", price: 2500, category: "Electronics", seller: "Green Energy Shop", rating: 4.5, reviews: 18, stock: 30, description: "10,000mAh solar-powered power bank. Charges 2 devices simultaneously. Waterproof.", whatsapp: "2207056789", images: ["/images/products/solar.jpg"], location: "Kololi", verified: false },
  { id: "p6", name: "Tie-Dye Kaftan", price: 750, category: "Fashion & Textiles", seller: "Mariama Couture", rating: 4.9, reviews: 45, stock: 12, description: "Beautiful hand-dyed kaftan in vibrant Gambian colours. Available in S, M, L, XL.", whatsapp: "2207067890", images: ["/images/products/kaftan.jpg"], location: "Serrekunda", verified: true },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.toLowerCase();
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 999999);

  let products = DEMO_PRODUCTS;
  if (category && category !== "all") products = products.filter((p) => p.category === category);
  if (q) products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  return NextResponse.json({ products, total: products.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, category, description, whatsapp, location } = body;

  if (!name || !price || !category || !description || !whatsapp) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = {
    id: `p${Date.now()}`,
    name, price, category, description, whatsapp, location: location ?? "",
    seller: "New Seller", rating: 0, reviews: 0, stock: 10,
    images: [], verified: false,
  };

  return NextResponse.json({ product, message: "Product created successfully" }, { status: 201 });
}
