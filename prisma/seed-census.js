// prisma/seed-census.js
// Run: node prisma/seed-census.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding GBOS Census Data...')

  // ─── National Census (1963–2024) ────────────────────────────────────────────
  const nationalData = [
    { year: 1963, population: 315486, growthRate: null, source: 'GBOS First Modern Census', notes: 'First post-independence census. Baseline for all modern demographic analysis.' },
    { year: 1973, population: 493499, growthRate: 4.58, source: 'GBOS Census 1973', notes: 'Strong growth driven by post-independence rural expansion.' },
    { year: 1983, population: 687817, growthRate: 3.38, source: 'GBOS Census 1983', notes: 'Moderate growth. Drought years 1977-1983 dampened rates.' },
    { year: 1993, population: 1038145, growthRate: 4.20, source: 'GBOS Census 1993', notes: 'Sharp rise driven by return of Senegambian migrants and high fertility.' },
    { year: 2003, population: 1360681, growthRate: 2.74, source: 'GBOS Census 2003', notes: 'Growth moderated as urbanisation increased and family sizes stabilised.' },
    { year: 2013, population: 1882450, growthRate: 3.30, source: 'GBOS Census 2013', notes: 'Acceleration linked to reduced under-5 mortality and large youth cohort.' },
    { year: 2024, population: 2422712, growthRate: 2.32, source: 'GBOS Digital Census 2024 (Preliminary)', notes: 'First fully digital census. Preliminary figure. Final report expected Q4 2025.' },
  ]

  let nationalCreated = 0, nationalSkipped = 0
  for (const row of nationalData) {
    const existing = await prisma.censusData.findUnique({ where: { year: row.year } })
    if (!existing) {
      await prisma.censusData.create({ data: row })
      nationalCreated++
    } else {
      nationalSkipped++
    }
  }
  console.log(`  ✅ National: ${nationalCreated} created, ${nationalSkipped} skipped`)

  // ─── LGA Data (1963, 1993, 2003, 2013, 2024) ────────────────────────────────
  const lgaData = [
    // 1963
    { year: 1963, lga: 'Banjul', population: 27809, urbanShare: 100 },
    { year: 1963, lga: 'Kanifing', population: 20459, urbanShare: 72 },
    { year: 1963, lga: 'Brikama', population: 65348, urbanShare: 8 },
    { year: 1963, lga: 'Mansakonko', population: 56420, urbanShare: 4 },
    { year: 1963, lga: 'Kerewan', population: 70234, urbanShare: 3 },
    { year: 1963, lga: 'Kuntaur', population: 42711, urbanShare: 3 },
    { year: 1963, lga: 'Janjanbureh', population: 32505, urbanShare: 6 },
    // 1993
    { year: 1993, lga: 'Banjul', population: 42326, urbanShare: 100 },
    { year: 1993, lga: 'Kanifing', population: 228214, urbanShare: 98 },
    { year: 1993, lga: 'Brikama', population: 259590, urbanShare: 22 },
    { year: 1993, lga: 'Mansakonko', population: 103981, urbanShare: 7 },
    { year: 1993, lga: 'Kerewan', population: 181168, urbanShare: 5 },
    { year: 1993, lga: 'Kuntaur', population: 81001, urbanShare: 5 },
    { year: 1993, lga: 'Janjanbureh', population: 107447, urbanShare: 9 },
    // 2003
    { year: 2003, lga: 'Banjul', population: 35061, urbanShare: 100 },
    { year: 2003, lga: 'Kanifing', population: 322735, urbanShare: 99 },
    { year: 2003, lga: 'Brikama', population: 389594, urbanShare: 28 },
    { year: 2003, lga: 'Mansakonko', population: 141718, urbanShare: 9 },
    { year: 2003, lga: 'Kerewan', population: 231061, urbanShare: 6 },
    { year: 2003, lga: 'Kuntaur', population: 100551, urbanShare: 6 },
    { year: 2003, lga: 'Janjanbureh', population: 107447, urbanShare: 11 },
    // 2013
    { year: 2013, lga: 'Banjul', population: 31301, urbanShare: 100 },
    { year: 2013, lga: 'Kanifing', population: 382096, urbanShare: 99 },
    { year: 2013, lga: 'Brikama', population: 706573, urbanShare: 35 },
    { year: 2013, lga: 'Mansakonko', population: 178921, urbanShare: 10 },
    { year: 2013, lga: 'Kerewan', population: 268637, urbanShare: 7 },
    { year: 2013, lga: 'Kuntaur', population: 118801, urbanShare: 7 },
    { year: 2013, lga: 'Janjanbureh', population: 180121, urbanShare: 12 },
    { year: 2013, lga: 'Basse', population: 251500, urbanShare: 9 },
  ]

  let lgaCreated = 0, lgaSkipped = 0
  for (const row of lgaData) {
    try {
      await prisma.lGACensusData.create({ data: row })
      lgaCreated++
    } catch {
      lgaSkipped++
    }
  }
  console.log(`  ✅ LGA: ${lgaCreated} created, ${lgaSkipped} skipped`)

  // ─── Colonial Era (1881–1963) ─────────────────────────────────────────────────
  const colonialData = [
    { year: 1881, area: 'Banjul (Bathurst)', population: 3500, qualityFlag: 'LOW', source: 'British Colonial Annual Report 1881', notes: 'Town count only. Rural Gambia largely uncounted.' },
    { year: 1891, area: 'Bathurst + Kombo', population: 14000, qualityFlag: 'LOW', source: 'Colonial Census 1891', notes: 'First attempt at territory-wide count. Methodology unreliable.' },
    { year: 1901, area: 'British Gambia', population: 90000, qualityFlag: 'MEDIUM', source: 'Colonial Census 1901', notes: 'Estimated. Tax register + headman counts.' },
    { year: 1911, area: 'British Gambia', population: 101000, qualityFlag: 'MEDIUM', source: 'Colonial Census 1911', notes: 'Slightly improved enumeration methodology.' },
    { year: 1921, area: 'British Gambia', population: 201520, qualityFlag: 'MEDIUM', source: 'Colonial Census 1921', notes: 'Major expansion of enumeration scope.' },
    { year: 1931, area: 'British Gambia', population: 199520, qualityFlag: 'MEDIUM', source: 'Colonial Census 1931', notes: 'Slight apparent decline likely reflects enumeration gaps, not population decline.' },
    { year: 1944, area: 'British Gambia', population: 214000, qualityFlag: 'MEDIUM', source: 'Wartime Estimate 1944', notes: 'Administrative estimate during WWII. No field enumeration.' },
    { year: 1951, area: 'British Gambia', population: 274000, qualityFlag: 'HIGH', source: 'Colonial Census 1951', notes: 'Most systematic colonial census. Used for post-independence planning.' },
    { year: 1963, area: 'Republic of The Gambia', population: 315486, qualityFlag: 'OFFICIAL', source: 'GBOS First National Census', notes: 'First post-independence official census. Sets modern baseline.' },
  ]

  let colonialCreated = 0, colonialSkipped = 0
  for (const row of colonialData) {
    try {
      await prisma.colonialCensus.create({ data: row })
      colonialCreated++
    } catch {
      colonialSkipped++
    }
  }
  console.log(`  ✅ Colonial: ${colonialCreated} created, ${colonialSkipped} skipped`)

  // ─── Pre-Colonial / Historical Estimates (1600–1880) ────────────────────────
  const historicalData = [
    {
      period: '1600–1650',
      populationLow: 60000,
      populationMid: 80000,
      populationHigh: 110000,
      region: 'Gambia River Basin',
      evidenceType: 'Portuguese and Dutch trade records',
      notes: 'Lower Gambia more densely settled. River was major trade artery. Mandinka kingdoms dominant.',
    },
    {
      period: '1650–1700',
      populationLow: 70000,
      populationMid: 95000,
      populationHigh: 130000,
      region: 'Gambia River Basin',
      evidenceType: 'Royal African Company records; Jobson accounts',
      notes: 'Growth despite Atlantic slave trade impact. Richard Jobson\'s 1620 account references populous riverside towns.',
    },
    {
      period: '1700–1750',
      populationLow: 75000,
      populationMid: 100000,
      populationHigh: 140000,
      region: 'Gambia River Basin',
      evidenceType: 'British and French trading post records',
      notes: 'Moderate growth. Slave trade at peak caused significant demographic disruption in some areas.',
    },
    {
      period: '1750–1800',
      populationLow: 80000,
      populationMid: 110000,
      populationHigh: 155000,
      region: 'Gambia River Basin',
      evidenceType: 'Abolitionist surveys; Mungo Park journals (1795)',
      notes: 'Mungo Park\'s 1795 Travels in the Interior Districts of Africa provides detailed accounts of Gambian settlements.',
    },
    {
      period: '1800–1840',
      populationLow: 95000,
      populationMid: 135000,
      populationHigh: 180000,
      region: 'British Gambia + hinterland',
      evidenceType: 'British missionary and colonial surveys',
      notes: 'Post-slave trade abolition (1807) created complex demographic shifts. Ceded Mile established 1816.',
    },
    {
      period: '1840–1880',
      populationLow: 120000,
      populationMid: 160000,
      populationHigh: 210000,
      region: 'British Gambia protectorate',
      evidenceType: 'Colonial administrative records; CMS mission reports',
      notes: 'Protectorate expanded 1820s-1880s. Soninke-Marabout Wars (1850-1901) caused significant displacement.',
    },
  ]

  let histCreated = 0, histSkipped = 0
  for (const row of historicalData) {
    try {
      await prisma.historicalEstimate.create({ data: row })
      histCreated++
    } catch {
      histSkipped++
    }
  }
  console.log(`  ✅ Historical: ${histCreated} created, ${histSkipped} skipped`)

  console.log('\n✅ Census seeding complete.')
  console.log('  📊 Summary:')
  console.log(`     National census records:  ${nationalCreated}`)
  console.log(`     LGA records:              ${lgaCreated}`)
  console.log(`     Colonial census records:  ${colonialCreated}`)
  console.log(`     Historical estimates:     ${histCreated}`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
