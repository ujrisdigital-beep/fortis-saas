// prisma/seed-data-sources.js
// Seeds 8 Gambian data sources into FORTIS OS™

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sources = [
  {
    name: 'Standard Newspaper Gambia',
    type: 'rss',
    url: 'https://standard.gm/feed/',
    category: 'news',
    fetchInterval: 720, // every 12 hours
  },
  {
    name: 'Foroyaa Newspaper',
    type: 'rss',
    url: 'https://foroyaa.net/feed/',
    category: 'news',
    fetchInterval: 720,
  },
  {
    name: 'The Point Newspaper',
    type: 'rss',
    url: 'https://thepoint.gm/feed/',
    category: 'news',
    fetchInterval: 720,
  },
  {
    name: 'Gambia Bureau of Statistics (GBoS)',
    type: 'api',
    url: 'https://www.gbosdata.org/',
    category: 'statistics',
    fetchInterval: 10080, // weekly
  },
  {
    name: 'NAWEC Power Updates',
    type: 'manual',
    url: 'https://nawec.gm/',
    category: 'energy',
    fetchInterval: 1440,
  },
  {
    name: 'Global Forest Watch — Gambia',
    type: 'api',
    url: 'https://data-api.globalforestwatch.org/',
    category: 'environment',
    fetchInterval: 10080,
  },
  {
    name: 'NASA FIRMS Active Fires (West Africa)',
    type: 'api',
    url: 'https://firms.modaps.eosdis.nasa.gov/api/country/csv',
    category: 'environment',
    fetchInterval: 1440,
  },
  {
    name: 'Gambia Agriculture Daily',
    type: 'rss',
    url: 'https://accessgambia.com/feed/',
    category: 'agriculture',
    fetchInterval: 1440,
  },
];

async function main() {
  console.log('Seeding data sources...');
  let created = 0;
  let skipped = 0;

  for (const src of sources) {
    const existing = await prisma.dataSource.findFirst({ where: { name: src.name } });
    if (existing) {
      console.log(`  SKIP: ${src.name} (already exists)`);
      skipped++;
      continue;
    }
    await prisma.dataSource.create({ data: src });
    console.log(`  + ${src.name}`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
