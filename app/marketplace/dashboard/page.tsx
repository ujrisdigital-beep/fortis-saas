"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

type Metrics = {
  totalTransactions: number;
  deliveryRate: number;
  averageRating: number;
  disputeRate: number;
  avgResolutionHours: number;
  activeSellers: number;
  activeBuyers: number;
  totalGMDEscrowed: number;
};

type Seller = { rank: number; name: string; sales: number; rating: number; badge: string; location: string };
type Buyer = { rank: number; name: string; purchases: number; totalSpent: number; badge: string };
type Activity = { action: string; detail: string; time: string };

const BADGE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Platinum: { bg: "#f8f0ff", text: "#6b21a8", icon: "💎" },
  Gold: { bg: "#fef3c7", text: "#92400e", icon: "🥇" },
  Silver: { bg: "#f1f5f9", text: "#475569", icon: "🥈" },
  Verified: { bg: "#dcfce7", text: "#065f46", icon: "✓" },
  Trusted: { bg: "#e0f2fe", text: "#0c4a6e", icon: "🤝" },
};

function MetricCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)" : "#FFFFFF",
      border: highlight ? "none" : "1.5px solid #E2E8F0",
      borderRadius: "0.85rem", padding: "1.25rem 1.5rem",
    }}>
      <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: highlight ? "rgba(255,255,255,0.7)" : "#64748B" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, color: highlight ? "#D4AF37" : "#0A1C2E", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: highlight ? "rgba(255,255,255,0.65)" : "#64748B" }}>{sub}</p>}
    </div>
  );
}

function Badge({ badge }: { badge: string }) {
  const bc = BADGE_COLORS[badge] ?? BADGE_COLORS.Trusted;
  return (
    <span style={{ background: bc.bg, color: bc.text, fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
      {bc.icon} {badge}
    </span>
  );
}

export default function MarketplaceDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalTransactions: 1247, deliveryRate: 98.7, averageRating: 4.82, disputeRate: 1.2,
    avgResolutionHours: 31, activeSellers: 89, activeBuyers: 412, totalGMDEscrowed: 284000,
  });
  const [sellers] = useState<Seller[]>([
    { rank: 1, name: "Fatou's Fashion House", sales: 124, rating: 4.97, badge: "Platinum", location: "Serrekunda" },
    { rank: 2, name: "Women's Shea Co-op", sales: 98, rating: 4.95, badge: "Platinum", location: "Banjul" },
    { rank: 3, name: "Green Energy Shop", sales: 76, rating: 4.88, badge: "Gold", location: "Kololi" },
    { rank: 4, name: "Master Craftsman", sales: 64, rating: 4.85, badge: "Gold", location: "Banjul Old Town" },
    { rank: 5, name: "Mariama Couture", sales: 59, rating: 4.91, badge: "Gold", location: "Serrekunda" },
    { rank: 6, name: "Local Farm Fresh", sales: 51, rating: 4.79, badge: "Silver", location: "Brikama" },
    { rank: 7, name: "Gambia Spices", sales: 44, rating: 4.82, badge: "Silver", location: "Banjul" },
    { rank: 8, name: "Atlantic Furniture", sales: 38, rating: 4.68, badge: "Verified", location: "Fajara" },
    { rank: 9, name: "Tech4Gambia", sales: 32, rating: 4.71, badge: "Verified", location: "KMC" },
    { rank: 10, name: "Heritage Crafts", sales: 28, rating: 4.65, badge: "Trusted", location: "Basse" },
  ]);
  const [buyers] = useState<Buyer[]>([
    { rank: 1, name: "Ousman N.", purchases: 34, totalSpent: 42500, badge: "Platinum" },
    { rank: 2, name: "Adama J.", purchases: 29, totalSpent: 38200, badge: "Platinum" },
    { rank: 3, name: "Isatou K.", purchases: 26, totalSpent: 31800, badge: "Gold" },
    { rank: 4, name: "Lamin S.", purchases: 22, totalSpent: 27400, badge: "Gold" },
    { rank: 5, name: "Fatou D.", purchases: 18, totalSpent: 22100, badge: "Gold" },
  ]);
  const [activity, setActivity] = useState<Activity[]>([
    { action: "Sale completed", detail: "Handmade Batik Fabric — D500", time: "2 min ago" },
    { action: "New seller registered", detail: "Banjul Spice Market (KYC pending)", time: "8 min ago" },
    { action: "Dispute resolved", detail: "Order #ORD-1731 — refund issued", time: "23 min ago" },
    { action: "5★ review posted", detail: "Organic Shea Butter", time: "31 min ago" },
    { action: "Escrow released", detail: "D1,200 to Master Craftsman", time: "45 min ago" },
    { action: "Sale completed", detail: "Solar Phone Charger — D2,500", time: "1 hr ago" },
  ]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Live counter simulation — updates every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((m) => ({
        ...m,
        totalTransactions: m.totalTransactions + Math.floor(Math.random() * 3),
        activeBuyers: m.activeBuyers + Math.floor(Math.random() * 2) - 1,
        totalGMDEscrowed: m.totalGMDEscrowed + Math.floor(Math.random() * 500),
      }));
      setActivity((prev) => [
        { action: "Sale completed", detail: `Order #ORD-${Date.now().toString(36).toUpperCase().slice(-4)} — D${(Math.floor(Math.random() * 20) + 2) * 100}`, time: "just now" },
        ...prev.slice(0, 5),
      ]);
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: "0.75rem" }}>
              <div>
                <span style={tagStyle}>📊 LIVE TRUST METRICS</span>
                <h1 style={heroTitleStyle}>Marketplace Dashboard</h1>
                <p style={heroSubStyle}>Real-time data. Every transaction updates this dashboard.</p>
              </div>
              <div style={liveIndicatorStyle}>
                <span style={liveDotStyle} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.8)" }}>LIVE · Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={contentStyle}>
          {/* Core Metrics */}
          <div style={metricsGridStyle}>
            <MetricCard label="Total Transactions" value={metrics.totalTransactions.toLocaleString()} sub="All time" highlight />
            <MetricCard label="Delivery Rate" value={`${metrics.deliveryRate}%`} sub="Successful deliveries" />
            <MetricCard label="Average Rating" value={`${metrics.averageRating}★`} sub="Across all sellers" />
            <MetricCard label="Dispute Rate" value={`${metrics.disputeRate}%`} sub="Below 2% target ✓" />
            <MetricCard label="Avg Resolution" value={`${metrics.avgResolutionHours}hrs`} sub="Dispute resolved in" />
            <MetricCard label="Active Sellers" value={metrics.activeSellers.toString()} sub="Verified & trading" />
            <MetricCard label="Active Buyers" value={metrics.activeBuyers.toString()} sub="This month" />
            <MetricCard label="GMD in Escrow" value={`D${metrics.totalGMDEscrowed.toLocaleString()}`} sub="Buyer-protected funds" highlight />
          </div>

          <div style={bottomGridStyle}>
            {/* Top Sellers */}
            <div style={tableCardStyle}>
              <h2 style={tableTitleStyle}>🏆 Top 10 Sellers</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
                {sellers.map((s) => (
                  <div key={s.rank} style={leaderRowStyle}>
                    <span style={{ fontWeight: 800, color: s.rank <= 3 ? "#D4AF37" : "#64748B", minWidth: "24px", fontSize: s.rank <= 3 ? "1rem" : "0.85rem" }}>
                      {s.rank <= 3 ? ["🥇", "🥈", "🥉"][s.rank - 1] : s.rank}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#0A1C2E", fontSize: "0.88rem" }}>{s.name}</p>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>📍 {s.location}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "0.15rem" }}>
                      <Badge badge={s.badge} />
                      <span style={{ fontSize: "0.72rem", color: "#64748B" }}>{s.sales} sales · ★{s.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
              {/* Top Buyers */}
              <div style={tableCardStyle}>
                <h2 style={tableTitleStyle}>🛒 Top 5 Buyers</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
                  {buyers.map((b) => (
                    <div key={b.rank} style={leaderRowStyle}>
                      <span style={{ fontWeight: 800, color: b.rank <= 3 ? "#D4AF37" : "#64748B", minWidth: "24px" }}>
                        {b.rank <= 3 ? ["🥇", "🥈", "🥉"][b.rank - 1] : b.rank}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#0A1C2E", fontSize: "0.88rem" }}>{b.name}</p>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>{b.purchases} purchases</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "0.15rem" }}>
                        <Badge badge={b.badge} />
                        <span style={{ fontSize: "0.72rem", color: "#64748B" }}>D{b.totalSpent.toLocaleString()} spent</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Feed */}
              <div style={tableCardStyle}>
                <h2 style={tableTitleStyle}>⚡ Live Activity Feed</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
                  {activity.map((a, i) => (
                    <div key={i} style={activityItemStyle}>
                      <div style={activityDotStyle} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#0A1C2E" }}>{a.action}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>{a.detail}</p>
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "#94A3B8", whiteSpace: "nowrap" as const }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badge legend */}
          <div style={badgeLegendStyle}>
            <h3 style={{ margin: "0 0 0.75rem", fontWeight: 800, fontSize: "0.92rem", color: "#0A1C2E" }}>Badge Criteria</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
              {[
                { badge: "Platinum", criteria: "100+ sales, 4.9★, 1yr+ active" },
                { badge: "Gold", criteria: "50+ sales, 4.8★, 6mo+ active" },
                { badge: "Silver", criteria: "20+ sales, 4.6★, 3mo+ active" },
                { badge: "Verified", criteria: "KYC complete, 5+ sales" },
                { badge: "Trusted", criteria: "KYC complete, registered" },
              ].map((b) => (
                <div key={b.badge} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Badge badge={b.badge} />
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{b.criteria}</span>
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
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "2.5rem 1.25rem 2rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.6rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.35rem", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, color: "#FFFFFF" };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "0.92rem" };
const liveIndicatorStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.5rem" };
const liveDotStyle: React.CSSProperties = { width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 1.5s infinite" };
const contentStyle: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const metricsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" };
const bottomGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" };
const tableCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.25rem 1.5rem" };
const tableTitleStyle: React.CSSProperties = { margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 800, color: "#0A1C2E" };
const leaderRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0", borderBottom: "1px solid #F8FAFC" };
const activityItemStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: "0.6rem" };
const activityDotStyle: React.CSSProperties = { width: "8px", height: "8px", borderRadius: "50%", background: "#1B4D3E", flexShrink: 0, marginTop: "0.3rem" };
const badgeLegendStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.25rem 1.5rem" };
