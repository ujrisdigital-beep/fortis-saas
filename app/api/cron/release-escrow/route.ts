// app/api/cron/release-escrow/route.ts
// Vercel Cron: daily auto-release of unclaimed escrow after 14 days
// Cron schedule: 0 6 * * * (daily at 06:00 UTC)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const host = req.headers.get('host') ?? '';
    if (!host.includes('localhost')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

  try {
    // Find orders: payment held, no buyer confirmation, no dispute, older than 14 days
    const eligibleOrders = await prisma.marketplaceOrder.findMany({
      where: {
        paymentStatus: 'held',
        buyerConfirmedAt: null,
        deliveryStatus: { notIn: ['disputed', 'pending'] },
        createdAt: { lt: cutoff },
      },
    });

    const released: string[] = [];
    const now = new Date();

    for (const order of eligibleOrders) {
      await prisma.marketplaceOrder.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'released',
          escrowReleasedAt: now,
          deliveryStatus: 'auto_confirmed',
        },
      });
      released.push(order.id);
    }

    console.log(`[ESCROW-RELEASE] Released ${released.length} orders. IDs: ${released.join(', ')}`);

    return NextResponse.json({
      ok: true,
      releasedCount: released.length,
      releasedOrderIds: released,
      cutoffDate: cutoff.toISOString(),
      processedAt: now.toISOString(),
    });
  } catch (err) {
    console.error('[ESCROW-RELEASE-ERROR]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
