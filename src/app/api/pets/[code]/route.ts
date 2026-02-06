import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const session = await getServerSession(authOptions)

    const qrcode = await prisma.qRCode.findUnique({
      where: { code },
      include: {
        pet: true,
      },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    // Check if current user is the owner
    const isOwner = session?.user?.id && qrcode.pet?.tutorId === session.user.id

    return NextResponse.json({
      status: qrcode.status,
      pet: qrcode.pet,
      isOwner: !!isOwner,
    })
  } catch (error) {
    console.error('Failed to fetch pet:', error)
    return NextResponse.json({ error: 'Failed to fetch pet' }, { status: 500 })
  }
}
