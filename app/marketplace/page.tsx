"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { useCurrency } from "../../hooks/useCurrency";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  seller: string;
  rating: number;
  reviews: number;
  description: string;
  whatsapp: string;
  location: string;
  verified: boolean;
};

const DEMO_PRODUCTS: Product[] = [
  { id: "p1", name: "Handmade Batik Fabric", price: 500, category: "Fashion & Textiles", seller: "Fatou's Fashion", rating: 4.8, reviews: 24, description: "Authentic Gambian batik fabric, hand-dyed. 2m x 1.5m.", whatsapp: "2207012345", location: "Serrekunda Market", verified: true },
  { id: "p2", name: "Organic Shea Butter", price: 300, category: "Beauty & Health", seller: "Women's Co-op", rating: 4.9, reviews: 67, description: "100% pure unrefined shea butter. 500g jar.", whatsapp: "2207023456", location: "Banjul", verified: true },
  { id: "p3", name: "Fresh Garden Vegetables", price: 200, category: "Food & Agriculture", seller: "Local Farm", rating: 4.7, reviews: 31, description: "Seasonal organic mixed vegetables. 5kg pack.", whatsapp: "2207034567", location: "Brikama", verified: true },
  { id: "p4", name: "Carved Wooden Bowl", price: 1200, category: "Crafts & Art", seller: "Master Craftsman", rating: 4.6, reviews: 12, description: "Hand-carved Gambian mahogany. Diameter 30cm.", whatsapp: "2207045678", location: "Banjul Old Town", verified: true },
  { id: "p5", name: "Solar Phone Charger", price: 2500, category: "Electronics", seller: "Green Energy Shop", rating: 4.5, reviews: 18, description: "10,000mAh solar power bank. Waterproof.", whatsapp: "2207056789", location: "Kololi", verified: false },
  { id: "p6", name: "Tie-Dye Kaftan", price: 750, category: "Fashion & Textiles", seller: "Mariama Couture", rating: 4.9, reviews: 45, description: "Hand-dyed kaftan. Sizes S–XL.", whatsapp: "2207067890", location: "Serrekunda", verified: true },
  { id: "p7", name: "Groundnut Oil (5L)", price: 850, category: "Food & Agriculture", seller: "Gambia Spices", rating: 4.8, reviews: 29, description: "Cold-pressed pure groundnut oil. 5-litre container.", whatsapp: "2207078901", location: "Banjul Market", verified: true },
  { id: "p8", name: "Woven Straw Basket", price: 350, category: "Crafts & Art", seller: "Heritage Crafts", rating: 4.7, reviews: 20, description: "Handwoven straw basket, traditional patterns. 40cm diameter.", whatsapp: "2207089012", location: "Basse", verified: false },
];

const CATEGORIES = ["All", "Fashion & Textiles", "Food & Agriculture", "Beauty & Health", "Crafts & Art", "Electronics"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#D4AF37", fontSize: "0.8rem", fontWeight: 700 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))} {rating.toFixed(1)}
    </span>
  );
}

export default function MarketplacePage() {
  const { fmt, fmtDual } = useCurrency();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<string[]>([]);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fortis_cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  function addToCart(id: string) {
    const updated = [...cart, id];
    setCart(updated);
    localStorage.setItem("fortis_cart", JSON.stringify(updated));
    setAdded(id);
    setTimeout(() => setAdded(null), 1500);
  }

  let products = DEMO_PRODUCTS;
  if (category !== "All") products = products.filter((p) => p.category === category);
  if (search) products = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === "price_asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") products = [...products].sort((a, b) => b.rating - a.rating);

  const cartCount = cart.length;

  return (
    <>
      <Navbar />
      <main style={pageStyle}>

        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "1rem" }}>
              <div>
                <span style={tagStyle}>🛍️ BUY GAMBIA MARKETPLACE</span>
                <h1 style={heroTitleStyle}>Shop Local. Buy Gambian.</h1>
                <p style={heroSubStyle}>Trusted marketplace connecting Gambian sellers with buyers nationwide. Escrow-protected payments.</p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const, alignSelf: "flex-end" }}>
                <Link href="/marketplace/cart" style={cartBtnStyle}>
                  🛒 Cart {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
                </Link>
                <Link href="/seller/register" style={sellerBtnStyle}>+ Sell on Buy Gambia</Link>
              </div>
            </div>

            {/* Trust stats */}
            <div style={trustRowStyle}>
              {[
                { label: "Active Sellers", value: "89+" },
                { label: "Products Listed", value: "450+" },
                { label: "Avg Rating", value: "4.82★" },
                { label: "Escrow Protected", value: "100%" },
              ].map((s) => (
                <div key={s.label} style={trustStatStyle}>
                  <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#D4AF37" }}>{s.value}</span>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={filtersBarStyle}>
          <div style={filtersInnerStyle}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const, flex: 1 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    padding: "0.45rem 0.9rem", borderRadius: "999px", border: `1.5px solid ${category === c ? "#1B4D3E" : "#E2E8F0"}`,
                    background: category === c ? "#1B4D3E" : "#FFFFFF", color: category === c ? "#FFFFFF" : "#0A1C2E",
                    fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
                  }}
                >{c}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="search"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInputStyle}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={sortSelectStyle}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div style={contentStyle}>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#64748B" }}>
            Showing <strong>{products.length}</strong> products
          </p>
          <div style={gridStyle}>
            {products.map((p) => (
              <article key={p.id} style={cardStyle}>
                {/* Product image placeholder */}
                <div style={imgPlaceholderStyle}>
                  <span style={{ fontSize: "2.5rem" }}>
                    {p.category === "Fashion & Textiles" ? "👗" : p.category === "Food & Agriculture" ? "🌾" : p.category === "Beauty & Health" ? "🧴" : p.category === "Electronics" ? "⚡" : "🎨"}
                  </span>
                </div>

                <div style={cardBodyStyle}>
                  {/* Badges */}
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" as const, marginBottom: "0.4rem" }}>
                    {p.verified && <span style={verifiedBadgeStyle}>✓ Verified</span>}
                    <span style={categoryBadgeStyle}>{p.category}</span>
                  </div>

                  <h3 style={productNameStyle}>{p.name}</h3>
                  <p style={sellerNameStyle}>by {p.seller} · {p.location}</p>
                  <div>
                    <StarRating rating={p.rating} />
                    <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "#64748B" }}>({p.reviews})</span>
                  </div>
                  <p style={descStyle}>{p.description}</p>

                  {/* Price */}
                  <div style={priceRowStyle}>
                    <span style={priceStyle}>{fmt(p.price)}</span>
                    {fmtDual(p.price) !== fmt(p.price) && (
                      <span style={gmdSubStyle}>· D{p.price.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={actionsRowStyle}>
                    <Link
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in your "${p.name}" listed on Buy Gambia Marketplace.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={waBtnStyle}
                    >
                      💬 WhatsApp
                    </Link>
                    <button
                      type="button"
                      onClick={() => addToCart(p.id)}
                      style={{
                        ...cartAddBtnStyle,
                        background: added === p.id ? "#1B4D3E" : "#0A1C2E",
                      }}
                    >
                      {added === p.id ? "✓ Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Trust panel */}
          <div style={trustPanelStyle}>
            {[
              { icon: "🔒", title: "Escrow Protection", body: "Buyer funds held safely until delivery confirmed." },
              { icon: "⭐", title: "Verified Sellers", body: "All verified sellers passed KYC checks." },
              { icon: "🔄", title: "Dispute Resolution", body: "72-hour resolution guarantee via UJRIS AI." },
              { icon: "📱", title: "WhatsApp Delivery", body: "Contact sellers directly for fast fulfilment." },
            ].map((t) => (
              <div key={t.title} style={trustPanelItemStyle}>
                <span style={{ fontSize: "1.75rem" }}>{t.icon}</span>
                <div>
                  <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.85rem", color: "#0A1C2E" }}>{t.title}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B", lineHeight: 1.5 }}>{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Styles
const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "2.5rem 1.25rem 2rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.6rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.4rem", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", lineHeight: 1.65 };
const cartBtnStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.4rem", position: "relative" as const, background: "rgba(255,255,255,0.15)", color: "#FFFFFF", padding: "0.55rem 1rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 700, fontSize: "0.88rem" };
const cartBadgeStyle: React.CSSProperties = { background: "#D4AF37", color: "#0A1C2E", borderRadius: "999px", padding: "0.1rem 0.45rem", fontSize: "0.7rem", fontWeight: 800 };
const sellerBtnStyle: React.CSSProperties = { display: "inline-block", background: "#D4AF37", color: "#0A1C2E", padding: "0.55rem 1rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 800, fontSize: "0.88rem" };
const trustRowStyle: React.CSSProperties = { display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" as const };
const trustStatStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.15rem" };
const filtersBarStyle: React.CSSProperties = { background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0.85rem 1.25rem", position: "sticky" as const, top: "60px", zIndex: 100 };
const filtersInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" as const };
const searchInputStyle: React.CSSProperties = { padding: "0.45rem 0.85rem", border: "1.5px solid #E2E8F0", borderRadius: "0.5rem", fontSize: "0.85rem", fontFamily: "inherit", outline: "none", minWidth: "180px" };
const sortSelectStyle: React.CSSProperties = { padding: "0.45rem 0.65rem", border: "1.5px solid #E2E8F0", borderRadius: "0.5rem", fontSize: "0.82rem", fontFamily: "inherit", background: "#FFFFFF", color: "#0A1C2E" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "1.75rem 1.25rem 5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" };
const cardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", overflow: "hidden", display: "flex", flexDirection: "column" as const };
const imgPlaceholderStyle: React.CSSProperties = { height: "160px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", display: "flex", alignItems: "center", justifyContent: "center" };
const cardBodyStyle: React.CSSProperties = { padding: "1rem 1.1rem 1.1rem", display: "flex", flexDirection: "column" as const, gap: "0.35rem", flex: 1 };
const verifiedBadgeStyle: React.CSSProperties = { background: "#dcfce7", color: "#065f46", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" };
const categoryBadgeStyle: React.CSSProperties = { background: "#f1f5f9", color: "#475569", fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px" };
const productNameStyle: React.CSSProperties = { margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0A1C2E", lineHeight: 1.3 };
const sellerNameStyle: React.CSSProperties = { margin: 0, fontSize: "0.75rem", color: "#64748B" };
const descStyle: React.CSSProperties = { margin: "0.1rem 0 0", fontSize: "0.8rem", color: "#64748B", lineHeight: 1.55, flex: 1 };
const priceRowStyle: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.35rem" };
const priceStyle: React.CSSProperties = { fontSize: "1.15rem", fontWeight: 800, color: "#1B4D3E" };
const gmdSubStyle: React.CSSProperties = { fontSize: "0.75rem", color: "#64748B" };
const actionsRowStyle: React.CSSProperties = { display: "flex", gap: "0.5rem", marginTop: "0.5rem" };
const waBtnStyle: React.CSSProperties = { flex: 1, background: "#25D366", color: "#FFFFFF", padding: "0.55rem 0.5rem", borderRadius: "0.45rem", textDecoration: "none", fontWeight: 700, fontSize: "0.78rem", textAlign: "center" as const };
const cartAddBtnStyle: React.CSSProperties = { flex: 1, color: "#FFFFFF", border: "none", padding: "0.55rem 0.5rem", borderRadius: "0.45rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", fontFamily: "inherit", transition: "background 0.2s" };
const trustPanelStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem 2rem" };
const trustPanelItemStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", alignItems: "flex-start" };
