// app/api/car-hire/bookings/route.ts
// POST: create a new car hire booking
// GET: list bookings (renter or owner)
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLATFORM_COMMISSION_RATE = 0.25 // 25%

const INSURANCE_TIERS: Record<string, { excess: number; dailyPremium: number }> = {
  basic: { excess: 5000, dailyPremium: 0 },
  standard: { excess: 3000, dailyPremium: 50 },
  premium: { excess: 0, dailyPremium: 90 },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const renterId = searchParams.get('renterId')
  const ownerId = searchParams.get('ownerId')
  const vehicleId = searchParams.get('vehicleId')

  try {
    const where: Record<string, unknown> = {}
    if (renterId) where.renterId = renterId
    if (ownerId) {
      // Find vehicleOwner by userId
      const owner = await prisma.vehicleOwner.findUnique({ where: { userId: ownerId } })
      if (owner) where.ownerId = owner.id
    }
    if (vehicleId) where.vehicleId = vehicleId

    const bookings = await prisma.carBooking.findMany({
      where,
      include: { vehicle: { select: { make: true, model: true, year: true, category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ ok: true, bookings })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { renterId, vehicleId, startTime, endTime, withDriver = false, insuranceTier = 'standard', pickupLocation, dropoffLocation } = body

    if (!renterId || !vehicleId || !startTime || !endTime) {
      return NextResponse.json({ error: 'renterId, vehicleId, startTime, endTime required' }, { status: 400 })
    }

    const vehicle = await prisma.hireVehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: { include: { escrowAccount: true } } },
    })
    if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    if (vehicle.status !== 'ACTIVE') return NextResponse.json({ error: 'Vehicle is not currently available for hire' }, { status: 400 })

    const escrow = vehicle.owner.escrowAccount
    if (!escrow || escrow.status !== 'ACTIVE' || escrow.currentBalance < escrow.minimumBalance) {
      return NextResponse.json({ error: "Vehicle owner's escrow is not active. This vehicle cannot be booked." }, { status: 400 })
    }

    const start = new Date(startTime)
    const end = new Date(endTime)
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const tier = INSURANCE_TIERS[insuranceTier] || INSURANCE_TIERS.standard
    const rentalAmount = vehicle.dailyRate * totalDays
    const driverAmount = withDriver && vehicle.driverRate ? vehicle.driverRate * totalDays : 0
    const insurancePremium = tier.dailyPremium * totalDays
    const totalAmount = rentalAmount + driverAmount + insurancePremium
    const platformCommission = totalAmount * PLATFORM_COMMISSION_RATE
    const ownerPayout = totalAmount - platformCommission

    // Check for conflicting bookings
    const conflict = await prisma.carBooking.findFirst({
      where: {
        vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          { startTime: { lte: end }, endTime: { gte: start } },
        ],
      },
    })
    if (conflict) return NextResponse.json({ error: 'Vehicle is already booked for those dates' }, { status: 409 })

    const booking = await prisma.carBooking.create({
      data: {
        renterId,
        vehicleId,
        ownerId: vehicle.ownerId,
        startTime: start,
        endTime: end,
        pickupLocation: pickupLocation || vehicle.locationKey,
        dropoffLocation: dropoffLocation || vehicle.locationKey,
        withDriver,
        totalDays,
        rentalAmount,
        driverAmount,
        platformCommission,
        ownerPayout,
        renterDeposit: 0, // ALWAYS ZERO — escrow model
        insuranceTier,
        insuranceExcess: tier.excess,
        status: 'PENDING',
      },
    })

    // Allocate escrow to booking
    await prisma.bookingEscrowAllocation.create({
      data: {
        bookingId: booking.id,
        escrowId: escrow.id,
        allocatedAmount: Math.min(escrow.currentBalance * 0.3, vehicle.requiresEscrow),
      },
    })

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        totalDays,
        rentalAmount,
        driverAmount,
        insurancePremium,
        totalAmount,
        platformCommission,
        ownerPayout,
        renterDeposit: 0,
        insuranceTier,
        insuranceExcess: tier.excess,
        status: 'PENDING',
        message: '✅ Booking created. No security deposit required from renter.',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
