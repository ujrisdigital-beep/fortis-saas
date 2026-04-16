"use client";

import Link from "next/link";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";
import { useCurrency } from "../../../hooks/useCurrency";

const DEMO_ORDERS = [
  {
    id: "ORD-1A2B3C", status: "delivered", items: [{ name: "Handmade Batik Fabric", qty: 1, price: 500 }],
    total: 500, date: "2026-04-10", seller: "Fatou's Fashion", escrow: "released", deliveryConfirmed: true,
  },
  {
    id: "ORD-4D5E6F", status: "in_transit", items: [{ name: "Organic Shea Butter", qty: 2, price: 300 }, { name: "Fresh Garden Vegetables", qty: 1, price: 200 }],
    total: 800, date: "2026-04-12", seller: "Multiple sellers", escrow: "holding", deliveryConfirmed: false,
  },
  {
    id: "ORD-7G8H9I", status: "pending_payment", items: [{ name: "Solar Phone Charger", qty: 1, price: 2500 }],
    total: 2500, date: "2026-04-13", seller: "Green Energy Shop", escrow: "pending", deliveryConfirmed: false,
  },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending_payment: { label: "Pending Payment", color: "#92400e", bg: "#fef3c7" },
  confirmed: { label: "Confirmed", color: "#1e40af", bg: "#dbeafe" },
  in_transit: { label: "In Transit", color: "#0c4a6e", bg: "#e0f2fe" },
  delivered: { label: "Delivered ✓", color: "#065f46", bg: "#dcfce7" },
  disputed: { label: "Disputed", color: "#991b1b", bg: "#fee2e2" },
};

const ESCROW_LABELS: Record<string, string> = {
  pending: "⏳ Pending",
  holding: "🔒 Held in Escrow",
  released: "✅ Released to Seller",
  refunded: "↩️ Refunded to You",
};

export default function OrdersPage() {
  const { fmt } = useCurrency();

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={contentStyle}>
          <div style={headerRowStyle}>
            <h1 style={titleStyle}>My Orders</h1>
            <Link href="/marketplace/disputes" style={disputeLinkStyle}>⚖️ File a Dispute</Link>
          </div>

          {DEMO_ORDERS.length === 0 ? (
            <div style={emptyStyle}>
              <p style={{ fontSize: "3rem", margin: 0 }}>📦</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0A1C2E" }}>No orders yet</p>
              <Link href="/marketplace" style={shopBtnStyle}>Start Shopping →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
              {DEMO_ORDERS.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending_payment;
                return (
                  <div key={order.id} style={orderCardStyle}>
                    {/* Header */}
                    <div style={orderHeaderStyle}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, color: "#0A1C2E", fontSize: "0.92rem" }}>{order.id}</p>
                        <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: "#64748B" }}>Placed {order.date} · {order.seller}</p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ ...statusBadgeStyle, background: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>
                          {ESCROW_LABELS[order.escrow]}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={itemsListStyle}>
                      {order.items.map((item) => (
                        <div key={item.name} style={orderItemRowStyle}>
                          <span style={{ fontSize: "0.88rem", color: "#0A1C2E" }}>{item.name} × {item.qty}</span>
                          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1B4D3E" }}>{fmt(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div style={{ ...orderItemRowStyle, borderTop: "1px solid #F1F5F9", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                        <span style={{ fontWeight: 700 }}>Total</span>
                        <span style={{ fontWeight: 800, color: "#0A1C2E" }}>{fmt(order.total)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={actionsRowStyle}>
                      {!order.deliveryConfirmed && order.status === "in_transit" && (
                        <button type="button" style={confirmBtnStyle}>
                          ✅ Confirm Delivery & Release Funds
                        </button>
                      )}
                      {!order.deliveryConfirmed && order.status !== "delivered" && (
                        <Link href="/marketplace/disputes" style={disputeItemLinkStyle}>
                          ⚖️ File Dispute
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
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
const headerRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0A1C2E" };
const disputeLinkStyle: React.CSSProperties = { background: "#fee2e2", color: "#991b1b", padding: "0.55rem 1rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" };
const emptyStyle: React.CSSProperties = { textAlign: "center" as const, padding: "5rem 2rem", background: "#FFFFFF", border: "1.5px dashed #E2E8F0", borderRadius: "1rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const shopBtnStyle: React.CSSProperties = { display: "inline-block", background: "#1B4D3E", color: "#FFFFFF", padding: "0.75rem 2rem", borderRadius: "0.6rem", textDecoration: "none", fontWeight: 700 };
const orderCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderLeft: "4px solid #1B4D3E", borderRadius: "0.85rem", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column" as const, gap: "0.85rem" };
const orderHeaderStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "0.5rem" };
const statusBadgeStyle: React.CSSProperties = { padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700 };
const itemsListStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.4rem" };
const orderItemRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between" };
const actionsRowStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", flexWrap: "wrap" as const };
const confirmBtnStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", border: "none", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit" };
const disputeItemLinkStyle: React.CSSProperties = { display: "inline-block", background: "#fff7ed", border: "1.5px solid #fed7aa", color: "#92400e", padding: "0.55rem 1rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 700, fontSize: "0.82rem" };
