'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Edit Pet Profile</h1>
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
    </div>
  )
}
