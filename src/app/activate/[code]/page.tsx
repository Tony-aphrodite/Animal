'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ActivatePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const code = params.code as string

  const [qrStatus, setQrStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [tutorName, setTutorName] = useState('')
  const [tutorPhone, setTutorPhone] = useState('')
  const [contactType, setContactType] = useState('WHATSAPP')
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [sex, setSex] = useState('')
  const [observations, setObservations] = useState('')

  useEffect(() => {
    checkQRCode()
  }, [code])

  useEffect(() => {
    if (session?.user?.name) {
      setTutorName(session.user.name)
    }
  }, [session])

  const checkQRCode = async () => {
    try {
      const response = await fetch(`/api/pets/${code}`)
      const data = await response.json()

      if (response.status === 404) {
        setQrStatus('NOT_FOUND')
      } else if (data.status === 'ACTIVE') {
        router.push(`/pet/${code}`)
        return
      } else {
        setQrStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to check QR code:', error)
      setQrStatus('ERROR')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!tutorName || !tutorPhone) {
      setError('Name and phone are required')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          tutorName,
          tutorPhone,
          contactType,
          name: name || null,
          species: species || null,
          breed: breed || null,
          sex: sex || null,
          observations: observations || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to activate')
        return
      }

      // Redirect to the pet page
      router.push(`/pet/${code}`)
    } catch (error) {
      console.error('Failed to activate:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pipo-yellow-light to-pipo-green-light">
        <div className="animate-spin h-12 w-12 border-4 border-pipo-green border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (qrStatus === 'NOT_FOUND' || qrStatus === 'ERROR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">QR Code Not Found</h1>
          <p className="text-gray-600">This QR code is not registered in our system.</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pipo-yellow-light to-pipo-green-light p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pipo-yellow flex items-center justify-center">
              <span className="text-4xl">🐾</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Activate Your PIPO</h1>
            <p className="text-gray-600 mb-6">
              Register your pet with QR Code <span className="font-mono font-bold">#{code}</span>
            </p>
            <p className="text-gray-500 mb-6">
              Please sign in or create an account to continue
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?callbackUrl=/activate/${code}`}
                className="block w-full btn btn-primary py-3 text-center"
              >
                Sign In
              </Link>
              <Link
                href={`/register?callbackUrl=/activate/${code}`}
                className="block w-full btn btn-secondary py-3 text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pipo-yellow-light to-pipo-green-light p-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🐾</span>
            <span className="text-2xl font-bold text-pipo-yellow drop-shadow">PIPO</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Activate Your Pet&apos;s ID</h1>
          <p className="text-gray-600 mt-1">
            QR Code: <span className="font-mono font-bold">#{code}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Contact Information - Required */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span>
              Your Contact Info
              <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="tutorName" className="input-label">Your Name *</label>
                <input
                  id="tutorName"
                  type="text"
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                  className="input"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="tutorPhone" className="input-label">Phone Number *</label>
                <input
                  id="tutorPhone"
                  type="tel"
                  value={tutorPhone}
                  onChange={(e) => setTutorPhone(e.target.value)}
                  className="input"
                  placeholder="+55 11 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="input-label">Preferred Contact Method *</label>
                <div className="flex gap-4 mt-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${contactType === 'WHATSAPP' ? 'border-pipo-green bg-pipo-green-light' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="contactType"
                      value="WHATSAPP"
                      checked={contactType === 'WHATSAPP'}
                      onChange={(e) => setContactType(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xl">💬</span>
                    <span className="font-medium">WhatsApp</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${contactType === 'CALL' ? 'border-pipo-blue bg-pipo-blue-light' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="contactType"
                      value="CALL"
                      checked={contactType === 'CALL'}
                      onChange={(e) => setContactType(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xl">📞</span>
                    <span className="font-medium">Phone Call</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Information - Optional */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🐾</span>
              Pet Info
              <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="input-label">Pet&apos;s Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Pet's name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="species" className="input-label">Species</label>
                  <select
                    id="species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="input"
                  >
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="breed" className="input-label">Breed</label>
                  <input
                    id="breed"
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="input"
                    placeholder="Breed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sex" className="input-label">Sex</label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="observations" className="input-label">Notes / Medical Info</label>
                <textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="input min-h-[80px]"
                  placeholder="Any special notes..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full btn btn-secondary py-4 text-lg disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Activating...
              </span>
            ) : (
              '🐾 Activate Pet ID'
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            You can add more details and a photo later in your profile
          </p>
        </form>
      </div>
    </div>
  )
}
