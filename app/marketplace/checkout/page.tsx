"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";
import { useCurrency } from "../../../hooks/useCurrency";

const PRODUCT_DATA: Record<string, { name: string; price: number; seller: string }> = {
  p1: { name: "Handmade Batik Fabric", price: 500, seller: "Fatou's Fashion" },
  p2: { name: "Organic Shea Butter", price: 300, seller: "Women's Co-op" },
  p3: { name: "Fresh Garden Vegetables", price: 200, seller: "Local Farm" },
  p4: { name: "Carved Wooden Bowl", price: 1200, seller: "Master Craftsman" },
  p5: { name: "Solar Phone Charger", price: 2500, seller: "Green Energy Shop" },
  p6: { name: "Tie-Dye Kaftan", price: 750, seller: "Mariama Couture" },
  p7: { name: "Groundnut Oil (5L)", price: 850, seller: "Gambia Spices" },
  p8: { name: "Woven Straw Basket", price: 350, seller: "Heritage Crafts" },
};

export default function CheckoutPage() {
  const { fmt } = useCurrency();
  const [items, setItems] = useState<{ id: string; qty: number }[]>([]);
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", paymentMethod: "mobile", mobileNumber: "" });

  useEffect(() => {
    const stored = localStorage.getItem("fortis_cart");
    if (!stored) return;
    const ids: string[] = JSON.parse(stored);
    const map: Record<string, number> = {};
    ids.forEach((id) => { map[id] = (map[id] ?? 0) + 1; });
    setItems(Object.entries(map).map(([id, qty]) => ({ id, qty })));
  }, []);

  const subtotal = items.reduce((s, item) => s + (PRODUCT_DATA[item.id]?.price ?? 0) * item.qty, 0);
  const commission = Math.round(subtotal * 0.05);

  async function placeOrder() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    localStorage.removeItem("fortis_cart");
    setLoading(false);
    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <>
        <Navbar />
        <main style={pageStyle}>
          <div style={successCardStyle}>
            <div style={{ fontSize: "3.5rem" }}>✅</div>
            <h1 style={{ margin: "0.75rem 0 0.4rem", fontSize: "1.5rem", fontWeight: 800, color: "#0A1C2E" }}>Order Placed!</h1>
            <p style={{ color: "#64748B", margin: "0 0 0.5rem" }}>Order ID: <strong style={{ color: "#1B4D3E" }}>{orderId}</strong></p>
            <div style={escrowMsgStyle}>
              🔒 <strong>D{subtotal.toLocaleString()} held in escrow.</strong> Sellers have been notified.<br />
              Once you receive and confirm delivery, funds are released. You have <strong>7 days</strong> to raise a dispute.
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              <Link href="/marketplace/orders" style={primaryLinkStyle}>View My Orders →</Link>
              <Link href="/marketplace" style={secLinkStyle}>Continue Shopping</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>Checkout</h1>

          <div style={gridStyle}>
            {/* Form */}
            <div style={formCardStyle}>
              {step === "details" && (
                <div>
                  <h2 style={sectionTitleStyle}>Delivery Details</h2>
                  <div style={fieldsStyle}>
                    <Field label="Full Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your full name" />
                    <Field label="Phone Number *" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="e.g. 2207012345" type="tel" />
                    <Field label="Delivery Address *" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="Your full address incl. region" />
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!form.name || !form.phone || !form.address}
                    onClick={() => setStep("payment")}
                    style={{ width: "100%", marginTop: "1.5rem", opacity: (!form.name || !form.phone || !form.address) ? 0.5 : 1 }}
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div>
                  <h2 style={sectionTitleStyle}>Payment Method</h2>
                  <div style={fieldsStyle}>
                    {[
                      { id: "mobile", label: "📱 Mobile Money", sub: "Wave / Afrimoney — instant" },
                      { id: "bank", label: "🏦 Bank Transfer", sub: "Ecobank / GTBank" },
                      { id: "cash", label: "💵 Cash on Delivery", sub: "Pay when item arrives" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, paymentMethod: m.id }))}
                        style={{
                          padding: "0.85rem 1rem", borderRadius: "0.6rem", border: `2px solid ${form.paymentMethod === m.id ? "#1B4D3E" : "#E2E8F0"}`,
                          background: form.paymentMethod === m.id ? "rgba(27,77,62,0.06)" : "#FFFFFF",
                          cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const, display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem", color: "#0A1C2E" }}>{m.label}</p>
                          <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>{m.sub}</p>
                        </div>
                        {form.paymentMethod === m.id && <span style={{ color: "#1B4D3E", fontWeight: 800 }}>✓</span>}
                      </button>
                    ))}

                    {form.paymentMethod === "mobile" && (
                      <Field label="Mobile Money Number *" value={form.mobileNumber} onChange={(v) => setForm((f) => ({ ...f, mobileNumber: v }))} placeholder="e.g. 2207012345" type="tel" />
                    )}
                  </div>

                  <div style={escrowNoticeStyle}>
                    🔒 <strong>Escrow payment:</strong> Funds are held by the platform until you confirm delivery. Your money is safe.
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                    <button type="button" onClick={() => setStep("details")} style={backBtnStyle}>← Back</button>
                    <button type="button" className="btn-primary" disabled={loading} onClick={placeOrder} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
                      {loading ? "Placing order…" : `Place Order — D${subtotal.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={summaryCardStyle}>
              <h2 style={sectionTitleStyle}>Order Summary</h2>
              {items.map((item) => {
                const p = PRODUCT_DATA[item.id];
                if (!p) return null;
                return (
                  <div key={item.id} style={summaryItemStyle}>
                    <span style={{ color: "#0A1C2E", fontSize: "0.88rem" }}>{p.name} × {item.qty}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{fmt(p.price * item.qty)}</span>
                  </div>
                );
              })}
              <div style={dividerStyle} />
              <div style={summaryItemStyle}>
                <span style={{ color: "#64748B", fontSize: "0.85rem" }}>Platform commission (5%)</span>
                <span style={{ fontSize: "0.85rem" }}>{fmt(commission)}</span>
              </div>
              <div style={summaryItemStyle}>
                <span style={{ fontWeight: 800, color: "#0A1C2E" }}>Total</span>
                <span style={{ fontWeight: 800, color: "#1B4D3E", fontSize: "1.1rem" }}>D{subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.35rem" }}>
      <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" }}>{label}</label>
      <input type={type} className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const titleStyle: React.CSSProperties = { margin: "0 0 1.75rem", fontSize: "1.5rem", fontWeight: 800, color: "#0A1C2E" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.75rem", alignItems: "start" };
const formCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem" };
const sectionTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const backBtnStyle: React.CSSProperties = { background: "none", border: "1.5px solid #E2E8F0", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 700, color: "#64748B", fontFamily: "inherit", fontSize: "0.88rem" };
const escrowNoticeStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.6rem", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "#0A1C2E", lineHeight: 1.6, marginTop: "1.25rem" };
const summaryCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem", position: "sticky" as const, top: "80px", display: "flex", flexDirection: "column" as const, gap: "0.6rem" };
const summaryItemStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between" };
const dividerStyle: React.CSSProperties = { borderTop: "1.5px solid #E2E8F0" };
const successCardStyle: React.CSSProperties = { maxWidth: 520, margin: "5rem auto", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "1rem", padding: "3rem 2.5rem", display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const };
const escrowMsgStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.6rem", padding: "0.85rem 1.25rem", fontSize: "0.85rem", color: "#0A1C2E", lineHeight: 1.7, textAlign: "left" as const };
const primaryLinkStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 700, fontSize: "0.88rem" };
const secLinkStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0A1C2E", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 600, fontSize: "0.88rem" };
