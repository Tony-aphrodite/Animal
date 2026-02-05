'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPets()
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Pets</h1>
        <p className="text-gray-600 mt-1">Manage your registered pets</p>
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
    </div>
  )
}
