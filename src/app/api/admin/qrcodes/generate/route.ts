import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateSequentialCode } from '@/lib/qrcode'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { count = 1 } = await request.json()

    if (count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Get the last QR code to determine the next code
    const lastQRCode = await prisma.qRCode.findFirst({
      orderBy: { code: 'desc' },
    })

    const generatedCodes = []

    let currentCode = lastQRCode?.code || '00000'

    for (let i = 0; i < count; i++) {
      currentCode = generateSequentialCode(currentCode)

      // Create QR code in database (QR image is generated on-demand)
      const qrcode = await prisma.qRCode.create({
        data: {
          code: currentCode,
          status: 'RAW',
        },
      })

      generatedCodes.push(qrcode)
    }

    return NextResponse.json({
      message: `Generated ${count} QR code(s)`,
      qrcodes: generatedCodes,
    })
  } catch (error) {
    console.error('Failed to generate QR codes:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR codes' },
      { status: 500 }
    )
  }
}
