"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";
import { useCurrency } from "../../../hooks/useCurrency";

const PRODUCT_DATA: Record<string, { name: string; price: number; seller: string; emoji: string }> = {
  p1: { name: "Handmade Batik Fabric", price: 500, seller: "Fatou's Fashion", emoji: "👗" },
  p2: { name: "Organic Shea Butter", price: 300, seller: "Women's Co-op", emoji: "🧴" },
  p3: { name: "Fresh Garden Vegetables", price: 200, seller: "Local Farm", emoji: "🌾" },
  p4: { name: "Carved Wooden Bowl", price: 1200, seller: "Master Craftsman", emoji: "🎨" },
  p5: { name: "Solar Phone Charger", price: 2500, seller: "Green Energy Shop", emoji: "⚡" },
  p6: { name: "Tie-Dye Kaftan", price: 750, seller: "Mariama Couture", emoji: "👗" },
  p7: { name: "Groundnut Oil (5L)", price: 850, seller: "Gambia Spices", emoji: "🌾" },
  p8: { name: "Woven Straw Basket", price: 350, seller: "Heritage Crafts", emoji: "🎨" },
};

type CartItem = { id: string; qty: number };

export default function CartPage() {
  const { fmt, fmtDual } = useCurrency();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("fortis_cart");
    if (!stored) return;
    const ids: string[] = JSON.parse(stored);
    const map: Record<string, number> = {};
    ids.forEach((id) => { map[id] = (map[id] ?? 0) + 1; });
    setItems(Object.entries(map).map(([id, qty]) => ({ id, qty })));
  }, []);

  function updateQty(id: string, delta: number) {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
      ).filter((item) => item.qty > 0);
      const flat: string[] = updated.flatMap((item) => Array(item.qty).fill(item.id));
      localStorage.setItem("fortis_cart", JSON.stringify(flat));
      return updated;
    });
  }

  function remove(id: string) {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const flat: string[] = updated.flatMap((item) => Array(item.qty).fill(item.id));
      localStorage.setItem("fortis_cart", JSON.stringify(flat));
      return updated;
    });
  }

  const subtotal = items.reduce((sum, item) => {
    const p = PRODUCT_DATA[item.id];
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const commission = Math.round(subtotal * 0.05);

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>🛒 Shopping Cart</h1>

          {items.length === 0 ? (
            <div style={emptyStyle}>
              <p style={{ fontSize: "3rem", margin: 0 }}>🛒</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0A1C2E", margin: "0.5rem 0 0.25rem" }}>Your cart is empty</p>
              <p style={{ color: "#64748B", margin: "0 0 1.5rem" }}>Add products from the marketplace to get started.</p>
              <Link href="/marketplace" style={shopBtnStyle}>Browse Products →</Link>
            </div>
          ) : (
            <div style={gridStyle}>
              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
                {items.map((item) => {
                  const p = PRODUCT_DATA[item.id];
                  if (!p) return null;
                  return (
                    <div key={item.id} style={cartItemStyle}>
                      <div style={itemEmojiStyle}>{p.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 0.2rem", fontWeight: 700, color: "#0A1C2E", fontSize: "0.95rem" }}>{p.name}</p>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>by {p.seller}</p>
                        <p style={{ margin: "0.25rem 0 0", fontWeight: 700, color: "#1B4D3E", fontSize: "0.92rem" }}>{fmt(p.price)}{fmtDual(p.price) !== fmt(p.price) ? ` · D${p.price.toLocaleString()}` : ""}</p>
                      </div>
                      <div style={qtyControlStyle}>
                        <button type="button" onClick={() => updateQty(item.id, -1)} style={qtyBtnStyle}>−</button>
                        <span style={{ fontWeight: 700, minWidth: "24px", textAlign: "center" as const }}>{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, 1)} style={qtyBtnStyle}>+</button>
                      </div>
                      <p style={{ margin: 0, fontWeight: 800, color: "#0A1C2E", minWidth: "80px", textAlign: "right" as const }}>{fmt(p.price * item.qty)}</p>
                      <button type="button" onClick={() => remove(item.id)} style={removeBtnStyle}>✕</button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div style={summaryCardStyle}>
                <h2 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 800, color: "#0A1C2E" }}>Order Summary</h2>
                <div style={summaryRowStyle}>
                  <span style={{ color: "#64748B" }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>{fmt(subtotal)}</span>
                </div>
                <div style={summaryRowStyle}>
                  <span style={{ color: "#64748B" }}>Platform commission (5%)</span>
                  <span style={{ fontWeight: 700 }}>{fmt(commission)}</span>
                </div>
                <div style={summaryRowStyle}>
                  <span style={{ color: "#64748B" }}>Delivery</span>
                  <span style={{ fontWeight: 700, color: "#065f46" }}>Arranged with seller</span>
                </div>
                <div style={dividerStyle} />
                <div style={{ ...summaryRowStyle, fontSize: "1.1rem" }}>
                  <span style={{ fontWeight: 800, color: "#0A1C2E" }}>Total (GMD)</span>
                  <span style={{ fontWeight: 800, color: "#1B4D3E" }}>D{subtotal.toLocaleString()}</span>
                </div>
                {fmtDual(subtotal) !== fmt(subtotal) && (
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", color: "#64748B", textAlign: "right" as const }}>{fmt(subtotal)} {`at current rate`}</p>
                )}
                <div style={escrowBoxStyle}>
                  🔒 All payments are <strong>escrow-protected</strong> — funds held until you confirm delivery.
                </div>
                <Link href="/marketplace/checkout" style={checkoutBtnStyle}>
                  Proceed to Checkout →
                </Link>
                <Link href="/marketplace" style={continueLinkStyle}>← Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const titleStyle: React.CSSProperties = { margin: "0 0 1.75rem", fontSize: "1.5rem", fontWeight: 800, color: "#0A1C2E" };
const emptyStyle: React.CSSProperties = { textAlign: "center" as const, padding: "5rem 2rem", background: "#FFFFFF", border: "1.5px dashed #E2E8F0", borderRadius: "1rem" };
const shopBtnStyle: React.CSSProperties = { display: "inline-block", background: "#1B4D3E", color: "#FFFFFF", padding: "0.75rem 2rem", borderRadius: "0.6rem", textDecoration: "none", fontWeight: 700 };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.75rem", alignItems: "start" };
const cartItemStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" };
const itemEmojiStyle: React.CSSProperties = { width: "56px", height: "56px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", flexShrink: 0 };
const qtyControlStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.35rem", border: "1.5px solid #E2E8F0", borderRadius: "0.45rem", padding: "0.3rem 0.6rem" };
const qtyBtnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "#0A1C2E" };
const removeBtnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "0.9rem", padding: "0.25rem" };
const summaryCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem", position: "sticky" as const, top: "80px", display: "flex", flexDirection: "column" as const, gap: "0.6rem" };
const summaryRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: "0.88rem" };
const dividerStyle: React.CSSProperties = { borderTop: "1.5px solid #E2E8F0", margin: "0.25rem 0" };
const escrowBoxStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.5rem", padding: "0.7rem 0.85rem", fontSize: "0.78rem", color: "#0A1C2E", lineHeight: 1.6 };
const checkoutBtnStyle: React.CSSProperties = { display: "block", textAlign: "center" as const, background: "#1B4D3E", color: "#FFFFFF", padding: "0.85rem", borderRadius: "0.6rem", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem", marginTop: "0.25rem" };
const continueLinkStyle: React.CSSProperties = { display: "block", textAlign: "center" as const, color: "#64748B", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 };
