import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const qrcode = await prisma.qRCode.findUnique({
      where: { code },
      include: {
        pet: true,
      },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: qrcode.status,
      pet: qrcode.pet,
    })
  } catch (error) {
    console.error('Failed to fetch pet:', error)
    return NextResponse.json({ error: 'Failed to fetch pet' }, { status: 500 })
  }
}
