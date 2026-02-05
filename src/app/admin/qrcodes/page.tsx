'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface QRCode {
  id: string
  code: string
  status: string
  createdAt: string
  activatedAt: string | null
  pet?: {
    name: string | null
    tutorName: string
  } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function QRCodesPage() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'

  const [qrcodes, setQrcodes] = useState<QRCode[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [filter, setFilter] = useState(initialFilter)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateCount, setGenerateCount] = useState(1)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const fetchQRCodes = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/qrcodes?filter=${filter}&page=${page}&limit=20`
      )
      const data = await response.json()
      setQrcodes(data.qrcodes)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch QR codes:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchQRCodes()
  }, [fetchQRCodes])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/qrcodes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: generateCount }),
      })

      if (response.ok) {
        setShowGenerateModal(false)
        setGenerateCount(1)
        fetchQRCodes()
      }
    } catch (error) {
      console.error('Failed to generate QR codes:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (code: string) => {
    try {
      const response = await fetch(`/api/admin/qrcodes/download?code=${code}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pipo-qr-${code}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download QR code:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">QR Codes</h1>
          <p className="text-gray-600 mt-1">Manage and generate QR codes</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate QR Codes
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {['all', 'raw', 'active'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? f === 'raw'
                    ? 'bg-gray-700 text-white'
                    : f === 'active'
                    ? 'bg-pipo-green text-white'
                    : 'bg-pipo-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {pagination && (
                <span className="ml-2 text-sm opacity-80">
                  ({f === 'all' ? pagination.total : '...'})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* QR Codes Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-pipo-blue border-t-transparent rounded-full"></div>
          </div>
        ) : qrcodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p className="text-lg font-medium">No QR codes found</p>
            <p className="text-sm">Generate your first QR code to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Activated</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {qrcodes.map((qr, index) => (
                  <tr key={qr.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(pagination?.page || 1 - 1) * (pagination?.limit || 20) + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-800">{qr.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${qr.status === 'RAW' ? 'badge-raw' : 'badge-active'}`}>
                        {qr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {qr.pet ? (
                        <span>{qr.pet.name || 'Unnamed'}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(qr.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {qr.activatedAt ? formatDate(qr.activatedAt) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownload(qr.code)}
                        className="p-2 text-pipo-blue hover:bg-pipo-blue-light rounded-lg transition-colors"
                        title="Download PNG"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchQRCodes(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchQRCodes(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Generate QR Codes</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="count" className="input-label">
                  Number of QR Codes
                </label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={generateCount}
                  onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                  className="input"
                />
                <p className="text-sm text-gray-500 mt-1">Maximum 100 at a time</p>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn btn-primary disabled:opacity-50"
              >
                {generating ? 'Generating...' : `Generate ${generateCount} Code(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
