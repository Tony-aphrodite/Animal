import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateQRCodeBuffer } from '@/lib/qrcode'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    return NextResponse.json(qrcode)
  } catch (error) {
    console.error('Failed to fetch QR code:', error)
    return NextResponse.json({ error: 'Failed to fetch QR code' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.qRCode.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'QR Code deleted' })
  } catch (error) {
    console.error('Failed to delete QR code:', error)
    return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 })
  }
}
