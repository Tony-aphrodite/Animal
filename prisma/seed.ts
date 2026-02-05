import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// For Prisma 7, use adapter pattern
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pipo.com' },
    update: {},
    create: {
      email: 'admin@pipo.com',
      password: adminPassword,
      name: 'PIPO Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create sample Tutor user
  const tutorPassword = await bcrypt.hash('tutor123', 12)
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@example.com' },
    update: {},
    create: {
      email: 'tutor@example.com',
      password: tutorPassword,
      name: 'Sample Tutor',
      role: 'TUTOR',
    },
  })
  console.log('✅ Tutor user created:', tutor.email)

  // Create sample QR codes
  const qrCodes = []
  for (let i = 1; i <= 5; i++) {
    const code = i.toString().padStart(5, '0')
    const qr = await prisma.qRCode.upsert({
      where: { code },
      update: {},
      create: {
        code,
        status: 'RAW',
      },
    })
    qrCodes.push(qr)
  }
  console.log('✅ Created 5 sample QR codes')

  // Create a sample pet with the first QR code
  const pet = await prisma.pet.upsert({
    where: { qrCodeId: qrCodes[0].id },
    update: {},
    create: {
      qrCodeId: qrCodes[0].id,
      tutorId: tutor.id,
      name: 'Pipoca',
      species: 'Dog',
      breed: 'Mixed',
      sex: 'Male',
      tutorName: 'Sample Tutor',
      tutorPhone: '+5511999999999',
      contactType: 'WHATSAPP',
      observations: 'Friendly and playful',
    },
  })

  // Update QR code status
  await prisma.qRCode.update({
    where: { id: qrCodes[0].id },
    data: {
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
  })
  console.log('✅ Sample pet created:', pet.name)

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📋 Test Credentials:')
  console.log('   Admin: admin@pipo.com / admin123')
  console.log('   Tutor: tutor@example.com / tutor123')
  console.log('')
  console.log('🔗 Sample QR Code URLs:')
  console.log('   http://localhost:3000/pet/00001 (Active - with pet)')
  console.log('   http://localhost:3000/pet/00002 (Raw - needs activation)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
