import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";

export async function GET() {
  const access = await requireApiAccess("marketplace", "read");
  if (!access.ok) return access.response;
  return NextResponse.json({
    live: false,
    metrics: {
      totalTransactions: 0,
      deliveryRate: null,
      averageRating: null,
      disputeRate: null,
      activeSellers: 0,
      activeBuyers: 0,
      totalGMDEscrowed: 0,
    },
    topSellers: [],
    topBuyers: [],
    recentActivity: [],
    notice: "No marketplace GMV. Demo leaderboards unpublished.",
    updatedAt: new Date().toISOString(),
  });
}
