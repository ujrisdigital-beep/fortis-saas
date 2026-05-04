import { NextRequest, NextResponse } from 'next/server'
import { GAMBIA_REGIONS, CASE_TYPES } from '@/lib/gambia-regions'
import { PLATFORM_STATS } from '@/lib/national-asset-data'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get('range') || '30d'

  // Seed factor per range for demo variance
  const factor: Record<string, number> = { '7d': 0.2, '30d': 1, '90d': 2.8, all: 4.5 }
  const f = factor[range] ?? 1

  const byRegion: Record<string, number> = {}
  GAMBIA_REGIONS.forEach(r => {
    byRegion[r.id] = Math.round((r.population / 10000) * f * (0.8 + Math.random() * 0.4))
  })

  const byType: Record<string, number> = {}
  CASE_TYPES.forEach(t => {
    byType[t] = Math.round(15 * f * (0.7 + Math.random() * 0.6))
  })

  const total = Object.values(byType).reduce((a, b) => a + b, 0)

  return NextResponse.json({
    byRegion,
    byType,
    total,
    successRate: PLATFORM_STATS.successRate,
    avgResolutionDays: PLATFORM_STATS.avgResolutionDays,
    regionsActive: Object.keys(byRegion).length,
    period: range,
    lastUpdated: new Date().toISOString(),
    note: 'All data is anonymised and aggregated. No personally identifiable information is included.',
  })
}
