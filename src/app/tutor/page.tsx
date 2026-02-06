'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Pet {
  id: string
  name: string | null
  photo: string | null
  species: string | null
  breed: string | null
  qrCode: {
    code: string
  }
}

export default function TutorDashboard() {
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<any>(null)

  useEffect(() => {
    fetchPets()
  }, [])

  useEffect(() => {
    // Cleanup scanner when modal closes
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/tutor/pets')
      const data = await response.json()
      setPets(data.pets || [])
    } catch (error) {
      console.error('Failed to fetch pets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const code = manualCode.trim()
    if (!code) {
      setError('Please enter a QR code')
      return
    }

    // Check if QR code exists and is RAW
    try {
      const response = await fetch(`/api/pets/${code}`)
      const data = await response.json()

      if (response.status === 404) {
        setError('QR code not found')
        return
      }

      if (data.status === 'ACTIVE') {
        setError('This QR code is already registered to a pet')
        return
      }

      // Redirect to activation page
      router.push(`/activate/${code}`)
    } catch {
      setError('Failed to verify QR code')
    }
  }

  const startScanner = async () => {
    setScanning(true)
    setError('')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')

      if (scannerRef.current) {
        const html5QrCode = new Html5Qrcode('qr-scanner')
        html5QrCodeRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Extract code from URL (e.g., https://pipo.app/pet/00001 -> 00001)
            let code = decodedText
            const match = decodedText.match(/\/pet\/([^\/\?]+)/)
            if (match) {
              code = match[1]
            }

            // Stop scanner
            await html5QrCode.stop()
            setScanning(false)

            // Redirect to activation page
            router.push(`/activate/${code}`)
          },
          () => {} // Ignore errors during scanning
        )
      }
    } catch (err) {
      setError('Failed to start camera. Please allow camera access or enter code manually.')
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
      } catch {}
    }
    setScanning(false)
  }

  const closeModal = () => {
    stopScanner()
    setShowModal(false)
    setManualCode('')
    setError('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-pipo-green border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Pets</h1>
          <p className="text-gray-600 mt-1">Manage your registered pets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pipo-green hover:bg-pipo-green/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register Pet
        </button>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pipo-yellow-light flex items-center justify-center">
            <span className="text-4xl">🐾</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No pets registered yet</h2>
          <p className="text-gray-600 mb-6">
            Scan a PIPO QR code on your pet&apos;s collar to register them
          </p>
          <p className="text-sm text-gray-500">
            Or if you have a QR code, visit the URL to start registration
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="card hover:shadow-xl transition-shadow">
              <Link href={`/tutor/pet/${pet.id}`} className="block group">
                <div className="flex items-center gap-4">
                  {/* Pet Photo */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-pipo-green-light flex-shrink-0">
                    {pet.photo ? (
                      <img
                        src={pet.photo}
                        alt={pet.name || 'Pet'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🐾
                      </div>
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pipo-green transition-colors">
                      {pet.name || 'Unnamed Pet'}
                    </h3>
                    {pet.species && (
                      <p className="text-gray-600">
                        {pet.species}
                        {pet.breed && ` • ${pet.breed}`}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      QR Code: <span className="font-mono">{pet.qrCode.code}</span>
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-pipo-green transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Preview Link */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link
                  href={`/pet/${pet.qrCode.code}`}
                  className="text-sm text-pipo-blue hover:text-pipo-blue/80 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Public Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-pipo-blue-light rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-pipo-blue flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">How it works</h3>
            <p className="text-gray-600 text-sm mt-1">
              When someone finds your pet and scans the QR code on their collar,
              they&apos;ll see the information you&apos;ve registered and can contact you
              directly via WhatsApp or phone call.
            </p>
          </div>
        </div>
      </div>

      {/* Register Pet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Register New Pet</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* QR Scanner */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Scan QR Code</h3>
                {scanning ? (
                  <div className="space-y-3">
                    <div id="qr-scanner" ref={scannerRef} className="w-full rounded-lg overflow-hidden"></div>
                    <button
                      onClick={stopScanner}
                      className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel Scanning
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startScanner}
                    className="w-full py-3 bg-pipo-blue text-white rounded-lg font-semibold hover:bg-pipo-blue/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open Camera
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Manual Code Entry */}
              <form onSubmit={handleManualSubmit}>
                <h3 className="font-semibold text-gray-800 mb-3">Enter Code Manually</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter QR code (e.g., 00001)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pipo-green focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pipo-green text-white rounded-lg font-semibold hover:bg-pipo-green/90 transition-colors"
                  >
                    Go
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the code printed below the QR code on your pet&apos;s tag
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
