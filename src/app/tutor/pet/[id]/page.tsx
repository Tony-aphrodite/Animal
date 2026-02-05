'use client'

import { useEffect, useState, useRef } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [message, setMessage] = useState('')

  // Form state
  const [photo, setPhoto] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [observations, setObservations] = useState('')
  const [tutorName, setTutorName] = useState('')
  const [tutorPhone, setTutorPhone] = useState('')
  const [contactType, setContactType] = useState('WHATSAPP')
  const [secondaryPhone, setSecondaryPhone] = useState('')

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
      setPhoto(data.photo || null)
      setName(data.name || '')
      setSpecies(data.species || '')
      setBreed(data.breed || '')
      setBirthDate(data.birthDate ? data.birthDate.split('T')[0] : '')
      setSex(data.sex || '')
      setObservations(data.observations || '')
      setTutorName(data.tutorName || '')
      setTutorPhone(data.tutorPhone || '')
      setContactType(data.contactType || 'WHATSAPP')
      setSecondaryPhone(data.secondaryPhone || '')
    } catch (error) {
      console.error('Failed to fetch pet:', error)
      router.push('/tutor')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch(`/api/tutor/pets/${petId}/photo`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setPhoto(data.photo)
        setMessage('Photo uploaded successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to upload photo')
      }
    } catch (error) {
      console.error('Failed to upload photo:', error)
      setMessage('Failed to upload photo')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true)
    setMessage('')

    try {
      const response = await fetch(`/api/tutor/pets/${petId}/photo`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPhoto(null)
        setMessage('Photo removed successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to remove photo')
      }
    } catch (error) {
      console.error('Failed to remove photo:', error)
      setMessage('Failed to remove photo')
    } finally {
      setUploadingPhoto(false)
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
          name: name || null,
          species: species || null,
          breed: breed || null,
          birthDate: birthDate || null,
          sex: sex || null,
          observations: observations || null,
          tutorName,
          tutorPhone,
          contactType,
          secondaryPhone: secondaryPhone || null,
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
      <h1 className="text-2xl font-bold text-gray-800">Edit Pet Profile</h1>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pet Photo Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Pet Photo</h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center gap-4">
              {/* Photo Preview */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pipo-green bg-gray-100">
                {photo ? (
                  <img
                    src={photo}
                    alt="Pet"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🐾
                  </div>
                )}
              </div>

              {/* Upload/Remove Buttons */}
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="px-4 py-2 bg-pipo-blue text-white rounded-lg text-sm font-medium hover:bg-pipo-blue/90 transition-colors disabled:opacity-50"
                >
                  {uploadingPhoto ? 'Uploading...' : photo ? 'Change Photo' : 'Upload Photo'}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={uploadingPhoto}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">JPEG, PNG, WebP or GIF. Max 5MB.</p>
            </div>
          </div>
        </div>

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

            {/* Species and Sex Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSpecies('Dog')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      species === 'Dog'
                        ? 'bg-pipo-green text-white'
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
                        ? 'bg-pipo-green text-white'
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
                placeholder="Mixed Breed"
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Medical Information</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent min-h-[80px] resize-none"
                placeholder="Afraid of loud noises, takes medication for allergies..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    checked={contactType === 'WHATSAPP'}
                    onChange={() => setContactType('WHATSAPP')}
                    className="w-4 h-4 text-pipo-green focus:ring-pipo-green"
                  />
                  <span className="text-gray-700">WhatsApp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    checked={contactType === 'CALL'}
                    onChange={() => setContactType('CALL')}
                    className="w-4 h-4 text-pipo-blue focus:ring-pipo-blue"
                  />
                  <span className="text-gray-700">Phone Call</span>
                </label>
              </div>
            </div>

            {/* Primary Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
              <input
                type="tel"
                value={tutorPhone}
                onChange={(e) => setTutorPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="+55 11 99999-9999"
                required
              />
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone (Optional)</label>
              <input
                type="tel"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
                placeholder="+55 11 88888-8888"
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
