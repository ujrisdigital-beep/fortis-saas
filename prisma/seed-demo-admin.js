const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { email: 'demo@fortisos.gm',        password: 'Demo123!',  name: 'Demo Admin (Partners)',      role: 'SUPER_ADMIN' },
    { email: 'ceo@fortisos.gm',         password: 'Admin123!', name: 'Chief Executive Officer',    role: 'SUPER_ADMIN' },
    { email: 'samba.bajie@fortisos.gm', password: 'Admin123!', name: 'Samba Bajie',                role: 'SUPER_ADMIN' },
  ];

  console.log('🔐 FORTIS OS — Admin Account Setup\n');

  for (const acc of accounts) {
    const hash = await bcrypt.hash(acc.password, 12);
    const user = await prisma.user.upsert({
      where: { email: acc.email },
      update: { password: hash, role: acc.role, name: acc.name, emailVerified: new Date() },
      create: { email: acc.email, password: hash, role: acc.role, name: acc.name, emailVerified: new Date() },
    });
    console.log(`✅  ${acc.email}  |  ${acc.role}  |  ID: ${user.id}`);
  }

  console.log('\n📋 All 4 SUPER_ADMIN accounts:');
  console.log('   admin@fortisos.gm      → Admin123!   (created earlier)');
  console.log('   ceo@fortisos.gm        → Admin123!   (created now)');
  console.log('   samba.bajie@fortisos.gm → Admin123!  (created now)');
  console.log('   demo@fortisos.gm       → Demo123!    (partners/Dr Faye)');
  console.log('\n⚠️  Reset demo@fortisos.gm password after each external demo.');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
