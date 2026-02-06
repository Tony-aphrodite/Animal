import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateQRCodeBuffer } from '@/lib/qrcode'

// GET /api/qrcode/[code] - Generate QR code image dynamically
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Verify QR code exists
    const qrcode = await prisma.qRCode.findUnique({
      where: { code },
    })

    if (!qrcode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const buffer = await generateQRCodeBuffer(code, baseUrl)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
