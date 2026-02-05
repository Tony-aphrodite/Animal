import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateQRCodeBuffer } from '@/lib/qrcode'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const qrcode = await prisma.qRCode.findUnique({
      where: { code },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const buffer = await generateQRCodeBuffer(code, baseUrl)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="pipo-qr-${code}.png"`,
      },
    })
  } catch (error) {
    console.error('Failed to download QR code:', error)
    return NextResponse.json({ error: 'Failed to download QR code' }, { status: 500 })
  }
}
