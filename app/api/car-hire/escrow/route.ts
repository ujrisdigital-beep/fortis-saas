// app/api/car-hire/escrow/route.ts
// GET: get escrow balance for owner
// POST: deposit / withdraw actions
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ownerId = searchParams.get('ownerId')
  if (!ownerId) return NextResponse.json({ error: 'ownerId required' }, { status: 400 })

  try {
    const owner = await prisma.vehicleOwner.findUnique({
      where: { id: ownerId },
      include: {
        escrowAccount: {
          include: {
            transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
          },
        },
        vehicles: { select: { id: true, make: true, model: true, requiresEscrow: true, status: true } },
      },
    })
    if (!owner) return NextResponse.json({ error: 'Owner not found' }, { status: 404 })

    const escrow = owner.escrowAccount
    const requiredEscrow = owner.vehicles.reduce((s, v) => s + v.requiresEscrow, 0)
    const available = escrow ? Math.max(0, escrow.currentBalance - escrow.minimumBalance) : 0

    return NextResponse.json({
      ok: true,
      owner: { id: owner.id, businessName: owner.businessName, phone: owner.phone, isVerified: owner.isVerified },
      escrow: escrow
        ? {
            id: escrow.id,
            currentBalance: escrow.currentBalance,
            minimumBalance: escrow.minimumBalance,
            available,
            requiredEscrow,
            status: escrow.status,
            transactions: escrow.transactions,
          }
        : null,
      vehicles: owner.vehicles,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action, ownerId, amount, paymentRef } = body

  if (!ownerId || !action) return NextResponse.json({ error: 'ownerId and action required' }, { status: 400 })

  try {
    let escrow = await prisma.escrowAccount.findUnique({ where: { ownerId } })

    if (action === 'create') {
      // Create or activate escrow account
      if (escrow) return NextResponse.json({ ok: true, escrow, message: 'Account already exists' })
      escrow = await prisma.escrowAccount.create({
        data: { ownerId, currentBalance: 0, minimumBalance: 2000, status: 'PENDING_DEPOSIT' },
      })
      return NextResponse.json({ ok: true, escrow, message: 'Escrow account created' })
    }

    if (!escrow) return NextResponse.json({ error: 'No escrow account found. Create one first.' }, { status: 404 })

    if (action === 'deposit') {
      if (!amount || amount <= 0) return NextResponse.json({ error: 'Valid amount required' }, { status: 400 })
      const newBalance = escrow.currentBalance + amount
      const newStatus = newBalance >= escrow.minimumBalance ? 'ACTIVE' : escrow.status

      const [updated] = await prisma.$transaction([
        prisma.escrowAccount.update({
          where: { id: escrow.id },
          data: { currentBalance: newBalance, status: newStatus as 'ACTIVE' },
        }),
        prisma.escrowTransaction.create({
          data: {
            escrowId: escrow.id,
            amount,
            txType: 'DEPOSIT',
            description: `Escrow deposit D${amount.toLocaleString()}`,
            paymentRef: paymentRef || null,
          },
        }),
      ])
      // Reactivate suspended vehicles if escrow is now active
      if (newStatus === 'ACTIVE') {
        await prisma.hireVehicle.updateMany({
          where: { ownerId, status: 'SUSPENDED' },
          data: { status: 'ACTIVE' },
        })
      }
      return NextResponse.json({ ok: true, newBalance, status: newStatus, message: `D${amount.toLocaleString()} deposited successfully` })
    }

    if (action === 'withdraw_request') {
      // 45-day hold period — mark for release
      const amountToRelease = Math.max(0, escrow.currentBalance - escrow.minimumBalance)
      if (amountToRelease <= 0) return NextResponse.json({ error: 'No available balance to withdraw' }, { status: 400 })

      const releaseDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      await prisma.escrowAccount.update({
        where: { id: escrow.id },
        data: { status: 'RELEASING' },
      })
      await prisma.escrowTransaction.create({
        data: {
          escrowId: escrow.id,
          amount: -amountToRelease,
          txType: 'RELEASE',
          description: `Withdrawal request — release date: ${releaseDate.toDateString()}`,
        },
      })
      return NextResponse.json({
        ok: true,
        releaseDate,
        amountToRelease,
        message: `D${amountToRelease.toLocaleString()} will be released after 45-day hold on ${releaseDate.toDateString()}`,
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
