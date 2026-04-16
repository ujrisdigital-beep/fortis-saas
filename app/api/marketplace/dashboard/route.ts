import { NextResponse } from "next/server";

// Live metrics — in production these come from database aggregations
// Seeded with realistic Gambian marketplace numbers for demo/presentation

function liveCount(base: number, variance: number): number {
  return base + Math.floor(Math.random() * variance);
}

export async function GET() {
  const data = {
    metrics: {
      totalTransactions: liveCount(1247, 8),
      successfulDeliveries: 1231,
      deliveryRate: 98.7,
      averageRating: 4.82,
      disputeRate: 1.2,
      avgResolutionHours: 31,
      activeSellers: liveCount(89, 3),
      activeBuyers: liveCount(412, 12),
      totalGMDEscrowed: liveCount(284000, 5000),
      newSellersThisMonth: 14,
      newBuyersThisMonth: 67,
    },
    topSellers: [
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
    ],
    topBuyers: [
      { rank: 1, name: "Ousman N.", purchases: 34, totalSpent: 42500, badge: "Platinum" },
      { rank: 2, name: "Adama J.", purchases: 29, totalSpent: 38200, badge: "Platinum" },
      { rank: 3, name: "Isatou K.", purchases: 26, totalSpent: 31800, badge: "Gold" },
      { rank: 4, name: "Lamin S.", purchases: 22, totalSpent: 27400, badge: "Gold" },
      { rank: 5, name: "Fatou D.", purchases: 18, totalSpent: 22100, badge: "Gold" },
    ],
    recentActivity: [
      { action: "Sale completed", detail: "Handmade Batik Fabric — D500", time: "2 min ago" },
      { action: "New seller registered", detail: "Banjul Spice Market", time: "8 min ago" },
      { action: "Dispute resolved", detail: "Order #ORD-1731 — refund issued", time: "23 min ago" },
      { action: "5★ review posted", detail: "Organic Shea Butter", time: "31 min ago" },
      { action: "Escrow released", detail: "D1,200 to Master Craftsman", time: "45 min ago" },
    ],
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
