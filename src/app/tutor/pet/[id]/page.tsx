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
  const [photo, setPhoto] = useState('')
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [observations, setObservations] = useState('')
  const [tutorName, setTutorName] = useState('')
  const [tutorPhone, setTutorPhone] = useState('')
  const [contactType, setContactType] = useState('WHATSAPP')
  const [email, setEmail] = useState('')

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
      setPhoto(data.photo || '')
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
          photo: photo || null,
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Pet Profile</h1>
        <Link
          href={`/pet/${pet.qrCode.code}`}
          target="_blank"
          className="text-pipo-blue hover:underline text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </Link>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-pipo-green-light text-pipo-green-dark' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pet Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Pet Information</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-pipo-green-light flex-shrink-0 border-2 border-white shadow-md">
                {photo ? (
                  <img src={photo} alt="Pet" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="px-4 py-2 bg-pipo-blue text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-pipo-blue-dark transition-colors"
                >
                  Upload
                </label>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto('')}
                    className="px-4 py-2 text-red-500 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
                placeholder="Enter pet name"
              />
            </div>

            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
              <div className="flex gap-2">
                {['Dog', 'Cat', 'Bird', 'Other'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpecies(s)}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      species === s
                        ? 'bg-pipo-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
              />
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
                placeholder="Enter breed"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSex('Male')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    sex === 'Male'
                      ? 'bg-pipo-blue text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>♂</span> Male
                </button>
                <button
                  type="button"
                  onClick={() => setSex('Female')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    sex === 'Female'
                      ? 'bg-pipo-blue text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>♀</span> Female
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all min-h-[80px] resize-none"
                placeholder="Any special notes, medical conditions, etc."
              />
            </div>
          </div>
        </div>

        {/* Tutor Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Tutor Information</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
                placeholder="Your name"
                required
              />
            </div>

            {/* Contact Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactType === 'WHATSAPP'}
                    onChange={() => setContactType('WHATSAPP')}
                    className="w-5 h-5 rounded border-gray-300 text-pipo-green focus:ring-pipo-green"
                  />
                  <span className="text-gray-700">WhatsApp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactType === 'CALL'}
                    onChange={() => setContactType('CALL')}
                    className="w-5 h-5 rounded border-gray-300 text-pipo-blue focus:ring-pipo-blue"
                  />
                  <span className="text-gray-700">Call</span>
                </label>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={tutorPhone}
                onChange={(e) => setTutorPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
                placeholder="+55 11 99999-9999"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pipo-blue focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-pipo-green hover:bg-pipo-green-dark text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pipo-green/30"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  )
}
