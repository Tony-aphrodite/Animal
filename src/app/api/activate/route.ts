import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, tutorName, tutorPhone, contactType, name, species, breed, sex, observations } = await request.json()

    if (!code || !tutorName || !tutorPhone) {
      return NextResponse.json(
        { error: 'Code, tutor name, and phone are required' },
        { status: 400 }
      )
    }

    // Find the QR code
    const qrcode = await prisma.qRCode.findUnique({
      where: { code },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    if (qrcode.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'QR Code is already activated' },
        { status: 400 }
      )
    }

    // Create pet and activate QR code
    const pet = await prisma.pet.create({
      data: {
        qrCodeId: qrcode.id,
        tutorId: session.user.id,
        tutorName,
        tutorPhone,
        contactType: contactType || 'WHATSAPP',
        name: name || null,
        species: species || null,
        breed: breed || null,
        sex: sex || null,
        observations: observations || null,
      },
    })

    // Update QR code status
    await prisma.qRCode.update({
      where: { id: qrcode.id },
      data: {
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Pet registered successfully',
      pet,
    })
  } catch (error) {
    console.error('Failed to activate QR code:', error)
    return NextResponse.json(
      { error: 'Failed to activate QR code' },
      { status: 500 }
    )
  }
}
