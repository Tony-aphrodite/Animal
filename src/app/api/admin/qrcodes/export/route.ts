import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import archiver from 'archiver'
import { generateQRCodeBuffer } from '@/lib/qrcode'

// GET /api/admin/qrcodes/export?format=zip&filter=all
// GET /api/admin/qrcodes/export?format=csv&filter=raw
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const filter = searchParams.get('filter') || 'all'

    // Build filter condition
    let whereCondition = {}
    if (filter === 'raw') {
      whereCondition = { status: 'RAW' }
    } else if (filter === 'active') {
      whereCondition = { status: 'ACTIVE' }
    }

    // Fetch QR codes
    const qrcodes = await prisma.qRCode.findMany({
      where: whereCondition,
      include: {
        pet: {
          select: {
            name: true,
            tutorName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://pipo.app'

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Code,Status,URL,Created At,Activated At,Pet Name,Tutor Name\n'
      const csvRows = qrcodes.map((qr) => {
        const url = `${baseUrl}/pet/${qr.code}`
        const createdAt = qr.createdAt.toISOString().split('T')[0]
        const activatedAt = qr.activatedAt ? qr.activatedAt.toISOString().split('T')[0] : ''
        const petName = qr.pet?.name || ''
        const tutorName = qr.pet?.tutorName || ''
        return `${qr.code},${qr.status},${url},${createdAt},${activatedAt},"${petName}","${tutorName}"`
      }).join('\n')

      const csv = csvHeader + csvRows

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="pipo-qrcodes-${filter}-${Date.now()}.csv"`,
        },
      })
    } else if (format === 'zip') {
      // Generate ZIP with QR code images (generated on-demand)
      const archive = archiver('zip', { zlib: { level: 9 } })
      const chunks: Buffer[] = []

      archive.on('data', (chunk) => chunks.push(chunk))

      // Generate and add each QR code image to the archive
      for (const qr of qrcodes) {
        const buffer = await generateQRCodeBuffer(qr.code, baseUrl)
        archive.append(buffer, { name: `${qr.code}.png` })
      }

      // Add a manifest CSV
      const manifestHeader = 'Code,Status,URL,Created At,Activated At\n'
      const manifestRows = qrcodes.map((qr) => {
        const url = `${baseUrl}/pet/${qr.code}`
        const createdAt = qr.createdAt.toISOString().split('T')[0]
        const activatedAt = qr.activatedAt ? qr.activatedAt.toISOString().split('T')[0] : ''
        return `${qr.code},${qr.status},${url},${createdAt},${activatedAt}`
      }).join('\n')
      const manifest = manifestHeader + manifestRows
      archive.append(manifest, { name: 'manifest.csv' })

      await archive.finalize()

      // Wait for archive to complete
      await new Promise<void>((resolve) => {
        archive.on('end', resolve)
      })

      const buffer = Buffer.concat(chunks)

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="pipo-qrcodes-${filter}-${Date.now()}.zip"`,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
