"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../../../components/navbar";
import { Footer } from "../../../../components/footer";
import { useCurrency } from "../../../../hooks/useCurrency";

const PRODUCTS: Record<string, {
  id: string; name: string; price: number; category: string; seller: string;
  rating: number; reviews: number; description: string; whatsapp: string;
  location: string; verified: boolean; stock: number; details: string[];
}> = {
  p1: { id: "p1", name: "Handmade Batik Fabric", price: 500, category: "Fashion & Textiles", seller: "Fatou's Fashion", rating: 4.8, reviews: 24, description: "Authentic Gambian batik fabric, hand-dyed using traditional techniques. Each piece is unique, created by skilled artisans in Serrekunda Market. 2m x 1.5m. Perfect for clothing, home decor, and gift-giving.", whatsapp: "2207012345", location: "Serrekunda Market", verified: true, stock: 15, details: ["Material: 100% cotton", "Dimensions: 2m x 1.5m", "Technique: Hand-dyed batik", "Made in The Gambia", "Colourfast — machine washable at 30°C"] },
  p2: { id: "p2", name: "Organic Shea Butter", price: 300, category: "Beauty & Health", seller: "Women's Co-op", rating: 4.9, reviews: 67, description: "100% pure unrefined shea butter sourced from the Gambian countryside. No additives, preservatives, or chemicals. Handcrafted by our women's cooperative. 500g glass jar.", whatsapp: "2207023456", location: "Banjul", verified: true, stock: 50, details: ["Weight: 500g", "Grade: A raw unrefined", "Scent: Natural nutty", "Shelf life: 24 months", "Certifications: Organic, Fair Trade"] },
  p3: { id: "p3", name: "Fresh Garden Vegetables", price: 200, category: "Food & Agriculture", seller: "Local Farm", rating: 4.7, reviews: 31, description: "Seasonal mixed vegetables from certified organic farms in Brikama. Harvested fresh each morning. Includes tomatoes, peppers, okra, and seasonal greens. 5kg pack.", whatsapp: "2207034567", location: "Brikama", verified: true, stock: 20, details: ["Weight: 5kg mixed", "Harvest: Fresh daily", "Certification: Organic", "Delivery: Same day", "Packaging: Biodegradable"] },
  p4: { id: "p4", name: "Carved Wooden Bowl", price: 1200, category: "Crafts & Art", seller: "Master Craftsman", rating: 4.6, reviews: 12, description: "Hand-carved from Gambian mahogany wood by a third-generation craftsman. Each bowl has unique grain patterns. Diameter 30cm, depth 10cm. Food-safe oil finish.", whatsapp: "2207045678", location: "Banjul Old Town", verified: true, stock: 8, details: ["Material: Gambian mahogany", "Diameter: 30cm", "Depth: 10cm", "Finish: Food-safe linseed oil", "Handcrafted: One-of-a-kind"] },
};

const DEMO_REVIEWS = [
  { id: "r1", buyer: "Aminata K.", rating: 5, comment: "Beautiful fabric, exactly as described. Fast delivery and great communication!", date: "March 2026", verified: true },
  { id: "r2", buyer: "Mariama D.", rating: 4, comment: "Good quality. Slightly different shade than photo but still lovely.", date: "March 2026", verified: true },
  { id: "r3", buyer: "Fatoumata S.", rating: 5, comment: "Perfect quality. Will definitely order again from this seller.", date: "February 2026", verified: true },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS[params.id] ?? PRODUCTS["p1"];
  const { fmt, fmtDual } = useCurrency();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const stored = localStorage.getItem("fortis_cart");
    const cart: string[] = stored ? JSON.parse(stored) : [];
    const updated = [...cart, ...Array(qty).fill(product.id)];
    localStorage.setItem("fortis_cart", JSON.stringify(updated));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const avgRating = DEMO_REVIEWS.reduce((s, r) => s + r.rating, 0) / DEMO_REVIEWS.length;

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={contentStyle}>
          {/* Breadcrumb */}
          <nav style={breadcrumbStyle}>
            <Link href="/marketplace" style={{ color: "#1B4D3E", textDecoration: "none", fontWeight: 600 }}>Marketplace</Link>
            <span style={{ color: "#64748B" }}> / </span>
            <span style={{ color: "#64748B" }}>{product.name}</span>
          </nav>

          <div style={mainGridStyle}>
            {/* Left: image */}
            <div>
              <div style={imgBoxStyle}>
                <span style={{ fontSize: "5rem" }}>
                  {product.category === "Fashion & Textiles" ? "👗" : product.category === "Food & Agriculture" ? "🌾" : product.category === "Beauty & Health" ? "🧴" : product.category === "Electronics" ? "⚡" : "🎨"}
                </span>
              </div>
              {product.verified && (
                <div style={verifiedBoxStyle}>
                  <span style={{ color: "#065f46", fontWeight: 700 }}>✓ Verified Seller</span>
                  <span style={{ color: "#64748B", fontSize: "0.78rem" }}>KYC checked · Escrow enabled</span>
                </div>
              )}
            </div>

            {/* Right: details */}
            <div style={detailsColStyle}>
              <span style={catBadgeStyle}>{product.category}</span>
              <h1 style={productTitleStyle}>{product.name}</h1>
              <p style={sellerLineStyle}>Sold by <strong>{product.seller}</strong> · 📍 {product.location}</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#D4AF37", fontSize: "1rem" }}>{"★".repeat(Math.floor(avgRating))}{"☆".repeat(5 - Math.floor(avgRating))}</span>
                <span style={{ fontWeight: 700, color: "#0A1C2E" }}>{avgRating.toFixed(1)}</span>
                <span style={{ color: "#64748B", fontSize: "0.85rem" }}>({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div style={priceBlockStyle}>
                <span style={priceStyle}>{fmt(product.price)}</span>
                {fmtDual(product.price) !== fmt(product.price) && (
                  <span style={gmdNoteStyle}>D{product.price.toLocaleString()} GMD</span>
                )}
              </div>

              <p style={descStyle}>{product.description}</p>

              {/* Details list */}
              <ul style={detailsListStyle}>
                {product.details.map((d) => (
                  <li key={d} style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: "#1B4D3E" }}>•</span> {d}
                  </li>
                ))}
              </ul>

              {/* Qty + CTA */}
              <div style={qtyRowStyle}>
                <div style={qtyControlStyle}>
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtnStyle}>−</button>
                  <span style={{ fontWeight: 700, minWidth: "28px", textAlign: "center" as const }}>{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} style={qtyBtnStyle}>+</button>
                </div>
                <button type="button" onClick={addToCart} style={{ ...addCartBtnStyle, background: added ? "#1B4D3E" : "#0A1C2E" }}>
                  {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
              </div>

              <Link
                href={`https://wa.me/${product.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in your "${product.name}" (x${qty}) on Buy Gambia Marketplace.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={waBtnStyle}
              >
                💬 WhatsApp Seller Directly
              </Link>

              {/* Escrow notice */}
              <div style={escrowNoticeStyle}>
                <strong>🔒 Escrow Protection:</strong> Your payment is held safely until you confirm delivery. Dispute window: 7 days after receipt.
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div style={reviewsWrapStyle}>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.1rem", fontWeight: 800, color: "#0A1C2E" }}>
              Customer Reviews ({DEMO_REVIEWS.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
              {DEMO_REVIEWS.map((r) => (
                <div key={r.id} style={reviewCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontWeight: 700, color: "#0A1C2E", fontSize: "0.92rem" }}>{r.buyer}</span>
                      {r.verified && <span style={verifiedReviewBadgeStyle}>✓ Verified Purchase</span>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "0.2rem" }}>
                      <span style={{ color: "#D4AF37" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{r.date}</span>
                    </div>
                  </div>
                  <p style={{ margin: "0.5rem 0 0", color: "#0A1C2E", fontSize: "0.88rem", lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const breadcrumbStyle: React.CSSProperties = { fontSize: "0.85rem", marginBottom: "1.5rem" };
const mainGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start", marginBottom: "3rem" };
const imgBoxStyle: React.CSSProperties = { background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: "1rem", height: "340px", display: "flex", alignItems: "center", justifyContent: "center" };
const verifiedBoxStyle: React.CSSProperties = { marginTop: "0.85rem", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "0.6rem", padding: "0.6rem 1rem", display: "flex", flexDirection: "column" as const, gap: "0.15rem" };
const detailsColStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.85rem" };
const catBadgeStyle: React.CSSProperties = { display: "inline-block", background: "#f1f5f9", color: "#475569", fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: "999px" };
const productTitleStyle: React.CSSProperties = { margin: 0, fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, color: "#0A1C2E", lineHeight: 1.2 };
const sellerLineStyle: React.CSSProperties = { margin: 0, fontSize: "0.88rem", color: "#64748B" };
const priceBlockStyle: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: "0.5rem" };
const priceStyle: React.CSSProperties = { fontSize: "2rem", fontWeight: 800, color: "#1B4D3E" };
const gmdNoteStyle: React.CSSProperties = { fontSize: "0.88rem", color: "#64748B" };
const descStyle: React.CSSProperties = { margin: 0, color: "#0A1C2E", lineHeight: 1.7, fontSize: "0.92rem" };
const detailsListStyle: React.CSSProperties = { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.35rem", fontSize: "0.85rem", color: "#0A1C2E" };
const qtyRowStyle: React.CSSProperties = { display: "flex", gap: "1rem", alignItems: "center" };
const qtyControlStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.5rem", border: "1.5px solid #E2E8F0", borderRadius: "0.5rem", padding: "0.4rem 0.75rem" };
const qtyBtnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1.1rem", color: "#0A1C2E", padding: "0 0.25rem" };
const addCartBtnStyle: React.CSSProperties = { flex: 1, color: "#FFFFFF", border: "none", padding: "0.85rem 1.5rem", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "inherit", transition: "background 0.2s" };
const waBtnStyle: React.CSSProperties = { display: "block", textAlign: "center" as const, background: "#25D366", color: "#FFFFFF", padding: "0.85rem 1.5rem", borderRadius: "0.6rem", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" };
const escrowNoticeStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.6rem", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "#0A1C2E", lineHeight: 1.6 };
const reviewsWrapStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem 2rem" };
const reviewCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", border: "1.5px solid #F1F5F9", borderRadius: "0.65rem" };
const verifiedReviewBadgeStyle: React.CSSProperties = { marginLeft: "0.5rem", background: "#dcfce7", color: "#065f46", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "999px" };
