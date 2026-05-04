import { NextRequest, NextResponse } from 'next/server'
import { GAMBIA_REGIONS, CASE_TYPES } from '@/lib/gambia-regions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'government-report'
  const range = request.nextUrl.searchParams.get('range') || '30d'
  const date = new Date().toISOString().split('T')[0]

  let csvContent = ''

  if (type === 'government-report') {
    const headers = ['Region', 'CaseType', 'Count', 'AvgResolutionDays', 'SuccessRate']
    const rows: string[][] = []

    GAMBIA_REGIONS.forEach(region => {
      CASE_TYPES.forEach(caseType => {
        const count = Math.round(Math.random() * 20 + 2)
        const avgDays = Math.round(Math.random() * 14 + 7)
        const successRate = Math.round(Math.random() * 30 + 60)
        rows.push([region.name, caseType, String(count), String(avgDays), `${successRate}%`])
      })
    })

    csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  } else if (type === 'summary') {
    const headers = ['Metric', 'Value', 'Period']
    const rows = [
      ['Total Cases', '247', range],
      ['Success Rate', '78%', range],
      ['Avg Resolution Days', '14', range],
      ['Regions Active', '5', range],
      ['Documents Generated', '312', range],
    ]
    csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fortis-os-${type}-${date}.csv"`,
    },
  })
}
