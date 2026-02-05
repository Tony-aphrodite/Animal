'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Pet {
  id: string
  photo: string | null
  name: string | null
  species: string | null
  breed: string | null
  birthDate: string | null
  sex: string | null
  observations: string | null
  tutorName: string
  tutorPhone: string
  contactType: string
}

export default function PublicPetPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [pet, setPet] = useState<Pet | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPet()
  }, [code])

  const fetchPet = async () => {
    try {
      const response = await fetch(`/api/pets/${code}`)
      const data = await response.json()

      if (response.status === 404) {
        setStatus('NOT_FOUND')
      } else if (data.status === 'RAW') {
        // Redirect to activation page
        router.push(`/activate/${code}`)
        return
      } else {
        setStatus(data.status)
        setPet(data.pet)
      }
    } catch (error) {
      console.error('Failed to fetch pet:', error)
      setStatus('ERROR')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    if (!pet) return

    const phone = pet.tutorPhone.replace(/\D/g, '')

    if (pet.contactType === 'WHATSAPP') {
      const message = encodeURIComponent(
        `Hi! I found your pet ${pet.name || ''}. I scanned the PIPO QR code on their collar.`
      )
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    } else {
      window.location.href = `tel:${phone}`
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`
    }
    return `${years} year${years !== 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-header">
        <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (status === 'NOT_FOUND' || status === 'ERROR') {
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

  if (!pet) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="gradient-header px-4 pt-8 pb-24">
        <div className="max-w-lg mx-auto text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-pipo-yellow">PIPO</span>
          </div>
          <p className="text-white/80 text-sm">Pet Identification System</p>
        </div>
      </div>

      {/* Pet Card */}
      <div className="max-w-lg mx-auto px-4 -mt-16 pb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Pet Photo */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto -mt-0 mb-4 relative z-10 pt-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {pet.photo ? (
                  <img
                    src={pet.photo}
                    alt={pet.name || 'Pet'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pipo-green-light text-5xl">
                    🐾
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pet Name & Basic Info */}
          <div className="text-center px-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {pet.name || 'Unknown Name'}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
              {pet.species && <span>{pet.species}</span>}
              {pet.species && pet.breed && <span>•</span>}
              {pet.breed && <span>{pet.breed}</span>}
              {(pet.species || pet.breed) && pet.birthDate && <span>•</span>}
              {pet.birthDate && <span>{calculateAge(pet.birthDate)}</span>}
              {((pet.species || pet.breed || pet.birthDate) && pet.sex) && <span>•</span>}
              {pet.sex && <span>{pet.sex}</span>}
            </div>
          </div>

          {/* Tutor Info */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pipo-blue-light flex items-center justify-center text-pipo-blue font-bold text-lg">
                {pet.tutorName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500">Tutor</p>
                <p className="font-semibold text-gray-800">{pet.tutorName}</p>
              </div>
            </div>
          </div>

          {/* Observations */}
          {pet.observations && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Observations</p>
                  <p className="text-gray-600 text-sm mt-1">{pet.observations}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Button */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleContact}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                pet.contactType === 'WHATSAPP'
                  ? 'bg-pipo-green text-white'
                  : 'bg-pipo-blue text-white'
              }`}
            >
              {pet.contactType === 'WHATSAPP' ? (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact via WhatsApp
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Owner
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-600">
            <span>🐾</span>
            <span>Pet identified by QR Code</span>
            <span className="font-mono font-bold text-pipo-blue">#{code}</span>
            <span>• PIPO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
