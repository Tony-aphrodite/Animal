import QRCode from 'qrcode'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const QR_CODE_DIR = path.join(process.cwd(), 'public', 'qrcodes')

// Generate a unique 5-digit code
export function generateUniqueCode(existingCodes: string[]): string {
  const existingSet = new Set(existingCodes)
  let code: string

  do {
    const num = Math.floor(Math.random() * 100000)
    code = num.toString().padStart(5, '0')
  } while (existingSet.has(code))

  return code
}

// Generate sequential code based on last code
export function generateSequentialCode(lastCode: string | null): string {
  if (!lastCode) return '00001'
  const num = parseInt(lastCode, 10) + 1
  return num.toString().padStart(5, '0')
}

// Generate QR code image and save to file
export async function generateQRCodeImage(
  code: string,
  baseUrl: string
): Promise<string> {
  const url = `${baseUrl}/pet/${code}`
  const filename = `qr-${code}.png`
  const filePath = path.join(QR_CODE_DIR, filename)

  // Ensure directory exists
  await mkdir(QR_CODE_DIR, { recursive: true })

  // Generate high-quality QR code
  const qrBuffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 1024,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  })

  await writeFile(filePath, qrBuffer)

  return `/qrcodes/${filename}`
}

// Generate QR code as data URL (for preview)
export async function generateQRCodeDataURL(
  code: string,
  baseUrl: string
): Promise<string> {
  const url = `${baseUrl}/pet/${code}`

  return QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  })
}

// Generate QR code as buffer (for download)
export async function generateQRCodeBuffer(
  code: string,
  baseUrl: string
): Promise<Buffer> {
  const url = `${baseUrl}/pet/${code}`

  return QRCode.toBuffer(url, {
    type: 'png',
    width: 1024,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  })
}
