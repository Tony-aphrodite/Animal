'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  secondaryPhone: string | null
  qrCode: {
    code: string
  }
}

export default function EditPetPage() {
  const router = useRouter()
  const params = useParams()
  const petId = params.id as string

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [observations, setObservations] = useState('')
  const [tutorName, setTutorName] = useState('')
  const [tutorPhone, setTutorPhone] = useState('')
  const [contactType, setContactType] = useState('WHATSAPP')

  useEffect(() => {
    fetchPet()
  }, [petId])

  const fetchPet = async () => {
    try {
      const response = await fetch(`/api/tutor/pets/${petId}`)
      if (!response.ok) {
        router.push('/tutor')
        return
      }
      const data = await response.json()
      setPet(data)

      // Set form values
      setName(data.name || '')
      setSpecies(data.species || '')
      setBreed(data.breed || '')
      setBirthDate(data.birthDate ? data.birthDate.split('T')[0] : '')
      setSex(data.sex || '')
      setObservations(data.observations || '')
      setTutorName(data.tutorName || '')
      setTutorPhone(data.tutorPhone || '')
      setContactType(data.contactType || 'WHATSAPP')
    } catch (error) {
      console.error('Failed to fetch pet:', error)
      router.push('/tutor')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSaving(true)

    try {
      const response = await fetch(`/api/tutor/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: null,
          name: name || null,
          species: species || null,
          breed: breed || null,
          birthDate: birthDate || null,
          sex: sex || null,
          observations: observations || null,
          tutorName,
          tutorPhone,
          contactType,
          secondaryPhone: null,
        }),
      })

      if (response.ok) {
        setMessage('Pet information saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save. Please try again.')
      }
    } catch (error) {
      console.error('Failed to save pet:', error)
      setMessage('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-pipo-green border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!pet) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Pet Profile</h1>
        <Link
          href={`/pet/${pet.qrCode.code}`}
          target="_blank"
          className="px-4 py-2 bg-pipo-blue text-white rounded-lg text-sm font-medium hover:bg-pipo-blue/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Public Profile
        </Link>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pet Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Pet Information</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Pet Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="Pipoca"
              />
            </div>

            {/* Species and Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSpecies('Dog')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      species === 'Dog'
                        ? 'bg-pipo-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dog
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpecies('Cat')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      species === 'Cat'
                        ? 'bg-pipo-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cat
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSex('Male')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sex === 'Male'
                        ? 'bg-pipo-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('Female')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sex === 'Female'
                        ? 'bg-pipo-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="Demo"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
              />
            </div>

            {/* Sex Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    checked={sex === 'Male'}
                    onChange={() => setSex('Male')}
                    className="w-4 h-4 text-pipo-blue focus:ring-pipo-blue"
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    checked={sex === 'Female'}
                    onChange={() => setSex('Female')}
                    className="w-4 h-4 text-pipo-blue focus:ring-pipo-blue"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent min-h-[80px] resize-none"
                placeholder="Afraid of loud noises"
              />
            </div>
          </div>
        </div>

        {/* Tutor Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Tutor Information</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="Mariana Almeida"
                required
              />
            </div>

            {/* Contact Type - Radio Buttons */}
            <div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    checked={contactType === 'WHATSAPP'}
                    onChange={() => setContactType('WHATSAPP')}
                    className="w-4 h-4 text-pipo-green focus:ring-pipo-green"
                  />
                  <span className="text-gray-700">Whatsapp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    checked={contactType === 'CALL'}
                    onChange={() => setContactType('CALL')}
                    className="w-4 h-4 text-pipo-blue focus:ring-pipo-blue"
                  />
                  <span className="text-gray-700">Call</span>
                </label>
              </div>
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                value={tutorPhone}
                onChange={(e) => setTutorPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="mariana@example.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-pipo-green hover:bg-pipo-green/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* QR Code Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">QR Code</h2>
        </div>
        <div className="p-6 text-center">
          <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-24 h-24 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-3 0h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm2 0h1v1h-1v-1zm0 2h1v1h-1v-1zm-3 0h1v1h-1v-1zm1 1h1v1h-1v-1zm2 0h3v1h-3v-1z"/>
              </svg>
            </div>
            <p className="text-lg font-mono font-bold text-gray-800">#{pet.qrCode.code}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            This QR code is linked to your pet&apos;s profile. Anyone who scans it will see the public pet info.
          </p>
          <Link
            href={`/pet/${pet.qrCode.code}`}
            target="_blank"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-pipo-green text-white rounded-lg font-medium hover:bg-pipo-green/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Public Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
