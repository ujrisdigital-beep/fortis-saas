const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const ADMIN_ACCOUNTS = [
  { email: 'admin@fortisos.gm',       name: 'System Administrator',   role: 'SUPER_ADMIN', password: 'Admin123!' },
  { email: 'ceo@fortisos.gm',         name: 'CEO Fortis Invicta',     role: 'SUPER_ADMIN', password: 'Admin123!' },
  { email: 'samba.bajie@fortisos.gm', name: 'Samba Bajie',            role: 'SUPER_ADMIN', password: 'Admin123!' },
  { email: 'demo@fortisos.gm',        name: 'Demo Admin (Partners)',   role: 'SUPER_ADMIN', password: 'Demo123!' },
  { email: 'board@fortisos.gm',       name: 'Board Member',           role: 'BOARD',       password: 'Board123!' },
  { email: 'partners@fortisos.gm',    name: 'Partners Access',        role: 'MANAGER',     password: 'Partner123!' },
]

async function seedAllAdmins() {
  console.log('🔐 Seeding admin accounts...\n')

  for (const account of ADMIN_ACCOUNTS) {
    const hashedPassword = await bcrypt.hash(account.password, 12)

    const result = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password: hashedPassword,
        role: account.role,
        name: account.name,
        emailVerified: new Date(),
      },
      create: {
        email: account.email,
        password: hashedPassword,
        role: account.role,
        name: account.name,
        emailVerified: new Date(),
      },
    })

    console.log(`✅  ${account.email.padEnd(32)} → ${account.role.padEnd(12)} (${account.password})`)
  }

  console.log('\n🎉 All admin accounts seeded successfully!')
  console.log('\n📋 LOGIN CREDENTIALS')
  console.log('━'.repeat(62))
  ADMIN_ACCOUNTS.forEach(acc => {
    console.log(`${acc.email.padEnd(32)} ${acc.password.padEnd(14)} ${acc.role}`)
  })
  console.log('━'.repeat(62))
  console.log('\n🌐 Login at: https://fortisos.cloud/auth/login\n')
}

seedAllAdmins()
  .catch(e => { console.error('❌ Seed failed:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
