const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmins() {
  const hash = await bcrypt.hash('Admin123!', 12);
  
  const admins = [
    { email: 'ceo@fortisos.gm', name: 'CEO' },
    { email: 'samba.bajie@fortisos.gm', name: 'Samba Bajie' }
  ];
  
  for (const admin of admins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { password: hash, role: 'SUPER_ADMIN' },
      create: {
        email: admin.email,
        password: hash,
        role: 'SUPER_ADMIN',
        name: admin.name,
        emailVerified: new Date(),
      }
    });
    console.log('✅', admin.email);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 BOTH ADMIN ACCOUNTS CREATED!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('CEO:   ceo@fortisos.gm');
  console.log('Samba: samba.bajie@fortisos.gm');
  console.log('Password for both: Admin123!\n');
}

createAdmins()
  .catch(console.error)
  .finally(() => prisma.$disconnect());