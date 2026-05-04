// app/api/car-hire/claims/route.ts
// GET: get claim status
// POST: report damage / resolve claim
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const claimId = searchParams.get('claimId')
  const bookingId = searchParams.get('bookingId')

  if (!claimId && !bookingId) return NextResponse.json({ error: 'claimId or bookingId required' }, { status: 400 })

  try {
    const claim = await prisma.damageClaim.findFirst({
      where: claimId ? { id: claimId } : { bookingId: bookingId! },
      include: { booking: { select: { renterId: true, ownerId: true, vehicleId: true, startTime: true, endTime: true } } },
    })
    if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    return NextResponse.json({ ok: true, claim })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, bookingId, claimId, claimantId, claimantType, description, photos, estimatedAmount, approvedAmount, resolutionNotes } = body

    if (action === 'report') {
      if (!bookingId || !claimantId || !description || !estimatedAmount) {
        return NextResponse.json({ error: 'bookingId, claimantId, description, estimatedAmount required' }, { status: 400 })
      }

      const booking = await prisma.carBooking.findUnique({ where: { id: bookingId } })
      if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

      // Check for existing claim
      const existing = await prisma.damageClaim.findUnique({ where: { bookingId } })
      if (existing) return NextResponse.json({ error: 'A claim already exists for this booking' }, { status: 409 })

      const claim = await prisma.damageClaim.create({
        data: {
          bookingId,
          claimantId,
          claimantType: claimantType || 'owner',
          description,
          photos: photos || [],
          estimatedAmount,
          status: 'PENDING',
        },
      })

      // Freeze escrow while claim is under review
      const owner = await prisma.vehicleOwner.findUnique({ where: { id: booking.ownerId } })
      if (owner) {
        await prisma.escrowAccount.updateMany({
          where: { ownerId: owner.id },
          data: { status: 'FROZEN' },
        })
      }

      return NextResponse.json({ ok: true, claim, message: 'Claim submitted. Escrow frozen pending review (max 24h response).' })
    }

    if (action === 'resolve') {
      if (!claimId || approvedAmount === undefined) {
        return NextResponse.json({ error: 'claimId and approvedAmount required for resolve' }, { status: 400 })
      }

      const claim = await prisma.damageClaim.findUnique({
        where: { id: claimId },
        include: { booking: { include: { owner: { include: { escrowAccount: true } } } } },
      })
      if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 })

      const escrow = claim.booking.owner.escrowAccount
      if (!escrow) return NextResponse.json({ error: 'Owner escrow not found' }, { status: 404 })

      const isApproved = approvedAmount > 0
      const newBalance = escrow.currentBalance - (isApproved ? approvedAmount : 0)
      const newEscrowStatus = newBalance < escrow.minimumBalance ? 'DEPLETED' : 'ACTIVE'

      await prisma.$transaction([
        prisma.damageClaim.update({
          where: { id: claimId },
          data: {
            approvedAmount: isApproved ? approvedAmount : 0,
            status: isApproved ? 'APPROVED' : 'REJECTED',
            resolutionNotes: resolutionNotes || '',
            resolvedAt: new Date(),
          },
        }),
        ...(isApproved
          ? [
              prisma.escrowAccount.update({
                where: { id: escrow.id },
                data: { currentBalance: newBalance, status: newEscrowStatus as 'ACTIVE' | 'DEPLETED' },
              }),
              prisma.escrowTransaction.create({
                data: {
                  escrowId: escrow.id,
                  amount: -approvedAmount,
                  txType: 'CLAIM_DEDUCTION',
                  referenceId: claimId,
                  description: `Damage claim deduction — Booking ${claim.bookingId}`,
                },
              }),
            ]
          : [
              prisma.escrowAccount.update({
                where: { id: escrow.id },
                data: { status: 'ACTIVE' },
              }),
            ]),
      ])

      return NextResponse.json({
        ok: true,
        message: isApproved
          ? `✅ Claim approved. D${approvedAmount} deducted from escrow.`
          : '❌ Claim rejected. Escrow unfrozen.',
        newBalance: isApproved ? newBalance : escrow.currentBalance,
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
