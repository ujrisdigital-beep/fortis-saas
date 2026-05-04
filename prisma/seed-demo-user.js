// prisma/seed-demo-user.js
// Creates a demo user for testing FORTIS OS™

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'demo@fortisos.gm';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Demo user already exists — skipping.');
    return;
  }

  const password = await bcrypt.hash('Demo123!', 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Demo User',
      password,
      role: 'PUBLIC',
    },
  });

  console.log(`Created demo user: ${user.email} (role: ${user.role})`);
  console.log('Login: demo@fortisos.gm / Demo123!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
