// app/api/marketplace/order/[id]/confirm-delivery/route.ts
// Buyer confirms delivery → releases escrow to seller
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const orderId = params.id;
    const order = await prisma.marketplaceOrder.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    if (order.buyerEmail !== session.user.email) {
      return NextResponse.json({ error: 'You are not the buyer for this order.' }, { status: 403 });
    }
    if (order.paymentStatus !== 'held') {
      return NextResponse.json({ error: `Cannot confirm delivery. Payment status is: ${order.paymentStatus}` }, { status: 400 });
    }
    if (order.buyerConfirmedAt) {
      return NextResponse.json({ error: 'Delivery already confirmed.' }, { status: 400 });
    }

    const now = new Date();
    await prisma.marketplaceOrder.update({
      where: { id: orderId },
      data: {
        deliveryStatus: 'confirmed',
        buyerConfirmedAt: now,
        paymentStatus: 'released',
        escrowReleasedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Delivery confirmed. Escrow funds have been released to the seller.',
      orderId,
      confirmedAt: now.toISOString(),
    });
  } catch (err) {
    console.error('Confirm delivery error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// GET: Check delivery confirmation status
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: params.id },
      select: { id: true, deliveryStatus: true, buyerConfirmedAt: true, paymentStatus: true, escrowReleasedAt: true },
    });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
