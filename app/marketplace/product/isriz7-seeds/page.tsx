"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DARK = "#0A2E1A";
const G = "#1B4D3E";
const GOLD = "#C4943A";

const VARIANTS = [
  { id: "5kg", label: "5kg Bag", price: 250, coverage: "0.25 ha", stock: 48 },
  { id: "25kg", label: "25kg Bag (Bulk)", price: 1_100, coverage: "1.25 ha", stock: 22 },
  { id: "50kg", label: "50kg Sack (Cooperative)", price: 2_000, coverage: "2.5 ha", stock: 10 },
];

const SPECS = [
  { k: "Variety", v: "ISRIZ-7 (Salt-Tolerant Rice)" },
  { k: "Salt Tolerance", v: "Up to 6 dS/m salinity" },
  { k: "Expected Yield", v: "2.5–3.5 t/ha" },
  { k: "Growing Season", v: "120–130 days" },
  { k: "Suitable Soils", v: "Saline Tidal, Alluvial Lowland" },
  { k: "Regions", v: "LRR, CRR, NBR coastal" },
  { k: "Storage", v: "Cool, dry, sealed container" },
  { k: "Germination Rate", v: ">85% guaranteed" },
  { k: "Source", v: "AfricaRice certified seed bank" },
  { k: "GIEPA Eligible", v: "Yes — duty-free import" },
];

const REVIEWS = [
  { name: "Kaddy Jatta", location: "Lower River Region", rating: 5, text: "Used on 1 ha of saline lowland. Got 2.8t harvest first season. Excellent result." },
  { name: "Omar Barrow", location: "North Bank Region", rating: 5, text: "Our cooperative bought 25kg bags. Very good germination. Highly recommend." },
  { name: "Fatou Ceesay", location: "CRR East", rating: 4, text: "Good yield but we needed more technical support on fertiliser timing. Overall positive." },
];

export default function ISRIZ7SeedsPage() {
  const { data: session } = useSession();
  const [variant, setVariant] = useState(VARIANTS[0]);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const total = variant.price * qty;
  const coverage = (parseFloat(variant.coverage) * qty).toFixed(2);

  function handleAddToCart() {
    if (!session) {
      window.location.href = "/auth/login?redirect=/marketplace/product/isriz7-seeds";
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: "1.25rem" }}>
          <Link href="/marketplace" style={{ color: G, textDecoration: "none" }}>Marketplace</Link>
          {" / "}
          <Link href="/marketplace?category=seeds" style={{ color: G, textDecoration: "none" }}>Seeds</Link>
          {" / ISRIZ-7 Salt-Tolerant Rice"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, marginBottom: "1.5rem" }}>
          {/* Product visual */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "2.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 100, marginBottom: 16 }}>🌾</div>
            <div style={{ background: "#d1fae5", color: "#065f46", borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
              ✓ GIEPA Incentive Eligible
            </div>
            <div style={{ background: "rgba(196,148,58,0.1)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700, color: GOLD }}>
              AfricaRice Certified
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 24, width: "100%" }}>
              {[
                { icon: "💧", label: "Saline Resistant", sub: "Up to 6 dS/m" },
                { icon: "📦", label: "High Yield", sub: "2.5–3.5 t/ha" },
                { icon: "🌱", label: "Fast Growing", sub: "120–130 days" },
              ].map(({ icon, label, sub }) => (
                <div key={label} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: DARK, marginTop: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase panel */}
          <div>
            <div style={{ background: "rgba(196,148,58,0.1)", border: `1px solid rgba(196,148,58,0.3)`, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: GOLD, display: "inline-block", marginBottom: 10 }}>
              🧂 FORTIS AGRI-INTEL · SEEDS
            </div>
            <h1 style={{ fontWeight: 900, color: DARK, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", margin: "0 0 8px", lineHeight: 1.2 }}>ISRIZ-7 Salt-Tolerant Rice Seeds</h1>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: "1rem" }}>
              Certified high-yielding salt-tolerant rice variety developed for saline tidal zones. Maintains 70–85% yield under moderate salinity. Ideal for Lower River and North Bank regions.
            </p>

            {/* Variant selector */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Pack Size</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {VARIANTS.map(v => (
                  <button key={v.id} onClick={() => setVariant(v)} style={{
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                    background: variant.id === v.id ? "rgba(27,77,62,0.08)" : "#fafafa",
                    border: `1.5px solid ${variant.id === v.id ? G : "#e5e7eb"}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.15s",
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{v.label}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Covers {v.coverage}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, color: GOLD, fontSize: 16 }}>D{v.price.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: v.stock < 15 ? "#EF4444" : "#9ca3af" }}>{v.stock} in stock</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 800, color: DARK, width: 40, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(Math.min(variant.stock, qty + 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <div style={{ marginLeft: 12, fontSize: 13, color: "#9ca3af" }}>
                  Covers <strong style={{ color: DARK }}>{coverage} ha</strong>
                </div>
              </div>
            </div>

            {/* Total */}
            <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, borderRadius: 12, padding: "1rem", marginBottom: "1rem", border: "1px solid rgba(196,148,58,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#555", fontSize: 13 }}>{qty} × {variant.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Total coverage: {coverage} ha</div>
                </div>
                <div style={{ fontWeight: 900, color: GOLD, fontSize: 24 }}>D{total.toLocaleString()}</div>
              </div>
            </div>

            <button onClick={handleAddToCart} style={{
              width: "100%", padding: "13px", borderRadius: 10, border: "none",
              background: addedToCart ? "#10B981" : `linear-gradient(135deg, ${G}, #2E7D64)`,
              color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
              transition: "background 0.3s",
            }}>
              {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
            </button>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Link href="/soil-mapping/crop-suitability?crop=salt-tolerant-rice"
                style={{ flex: 1, textAlign: "center", padding: "9px", background: "#fff", color: G, borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", border: `1px solid ${G}` }}>
                Check Suitability First
              </Link>
              <a href="mailto:ceo@fortisos.co.uk?subject=ISRIZ-7 Bulk Order Enquiry"
                style={{ flex: 1, textAlign: "center", padding: "9px", background: "rgba(196,148,58,0.1)", color: GOLD, borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", border: `1px solid rgba(196,148,58,0.3)` }}>
                Bulk Order Enquiry
              </a>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 1rem" }}>🔬 Technical Specifications</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {SPECS.map(({ k, v }) => (
              <div key={k} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Salinity map CTA */}
        <div style={{ background: "rgba(27,77,62,0.06)", borderRadius: 12, border: "1px solid rgba(27,77,62,0.15)", padding: "1.25rem", marginBottom: "1.25rem", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 40 }}>🗺️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 4 }}>Is your land suitable for ISRIZ-7?</div>
            <div style={{ fontSize: 13, color: "#555" }}>Check the Gambia Salinity Monitor to see live readings for your region before purchasing.</div>
          </div>
          <Link href="/soil-mapping?tab=salinity" style={{ padding: "10px 18px", background: G, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
            Check Salinity Map →
          </Link>
        </div>

        {/* Reviews */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.25rem" }}>
          <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 1rem" }}>⭐ Farmer Reviews</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>{r.location}</span>
                  </div>
                  <div style={{ color: GOLD, fontSize: 14 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                </div>
                <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "2rem" }}>
          Fortis OS Marketplace · All seeds are AfricaRice certified · © FORTIS INVICTA LTD {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
