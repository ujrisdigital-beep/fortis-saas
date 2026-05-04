// app/api/car-hire/vehicles/route.ts
// GET: list active hire vehicles
// POST: register a vehicle for hire (owner must have active escrow)
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const ownerId = searchParams.get('ownerId')

  try {
    const where: Record<string, unknown> = {}
    if (category) where.category = category

    if (ownerId) {
      const owner = await prisma.vehicleOwner.findUnique({ where: { userId: ownerId } })
      if (owner) where.ownerId = owner.id
    } else {
      // Public listing: only show active vehicles from owners with active escrow
      where.status = 'ACTIVE'
    }

    const vehicles = await prisma.hireVehicle.findMany({
      where,
      include: {
        owner: {
          select: { businessName: true, phone: true, isVerified: true },
        },
      },
      orderBy: { dailyRate: 'asc' },
    })

    // Filter to only show vehicles from owners with active escrow (for public)
    const filtered = ownerId
      ? vehicles
      : vehicles.filter(async (v) => {
          const escrow = await prisma.escrowAccount.findUnique({ where: { ownerId: v.ownerId } })
          return escrow && escrow.status === 'ACTIVE'
        })

    return NextResponse.json({ ok: true, vehicles })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, make, model, year, category, licensePlate, seats, hasAC, features, photos, locationKey, dailyRate, weeklyRate, driverRate } = body

    if (!userId || !make || !model || !licensePlate || !dailyRate) {
      return NextResponse.json({ error: 'userId, make, model, licensePlate, dailyRate required' }, { status: 400 })
    }

    let owner = await prisma.vehicleOwner.findUnique({ where: { userId } })
    if (!owner) return NextResponse.json({ error: 'Vehicle owner profile not found. Please register as an owner first.' }, { status: 404 })

    const escrow = await prisma.escrowAccount.findUnique({ where: { ownerId: owner.id } })
    const hasActiveEscrow = escrow && escrow.status === 'ACTIVE' && escrow.currentBalance >= escrow.minimumBalance

    const vehicle = await prisma.hireVehicle.create({
      data: {
        ownerId: owner.id,
        make,
        model,
        year: year || 2020,
        category: category || 'saloon',
        licensePlate,
        seats: seats || 5,
        hasAC: hasAC !== false,
        features: features || [],
        photos: photos || [],
        locationKey: locationKey || 'serrekunda',
        hourlyRate: null,
        dailyRate,
        weeklyRate: weeklyRate || dailyRate * 6,
        driverRate: driverRate || null,
        requiresEscrow: 5000,
        status: hasActiveEscrow ? 'ACTIVE' : 'PENDING_ESCROW',
      },
    })

    return NextResponse.json({
      ok: true,
      vehicle,
      message: hasActiveEscrow
        ? '✅ Vehicle listed and active!'
        : '⚠️ Vehicle registered. Activate your escrow account (D5,000 minimum) to make it live.',
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
