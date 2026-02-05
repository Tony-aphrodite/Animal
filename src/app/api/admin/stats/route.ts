import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalQRCodes, rawQRCodes, activeQRCodes, totalPets] = await Promise.all([
      prisma.qRCode.count(),
      prisma.qRCode.count({ where: { status: 'RAW' } }),
      prisma.qRCode.count({ where: { status: 'ACTIVE' } }),
      prisma.pet.count(),
    ])

    return NextResponse.json({
      totalQRCodes,
      rawQRCodes,
      activeQRCodes,
      totalPets,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
