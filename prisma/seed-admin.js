const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: {
        in: ['admin@fortisos.gm', 'super@fortisos.gm']
      }
    }
  })

  if (existingAdmin) {
    console.log('✅ Admin already exists:', existingAdmin.email)
    console.log('Role:', existingAdmin.role)
    return
  }

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@fortisos.gm',
      password: '$2a$12$1T9C2uyXukG/bOzRR1CRyuDpQryU8IJqbVszD7zbw/qhcNs7sUf4m',
      role: 'SUPER_ADMIN',
      name: 'System Administrator',
      emailVerified: new Date(),
    }
  })

  console.log('✅ SUPER_ADMIN created successfully!')
  console.log('Email:', superAdmin.email)
  console.log('Role:', superAdmin.role)
  console.log('Password: Admin123!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
