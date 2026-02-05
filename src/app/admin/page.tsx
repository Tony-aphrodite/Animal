'use client'

import { useEffect, useState, useCallback } from 'react'

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

export default function AdminDashboard() {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateCount, setGenerateCount] = useState(1)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const fetchQRCodes = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/qrcodes?filter=${filter}&page=${page}&limit=10`
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
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Export QR Codes Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Export QR Codes</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 rounded-lg bg-pipo-green text-white font-medium hover:bg-pipo-green/90 transition-colors"
            >
              Generate/Excel
            </button>
            <button
              onClick={() => setFilter('raw')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'raw'
                  ? 'bg-pipo-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Raw
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-pipo-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-pipo-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* QR Codes List */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">QR Codes List</h2>
        </div>

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Activated At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {qrcodes.map((qr) => (
                  <tr key={qr.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-800">{qr.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        qr.status === 'RAW'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {qr.status === 'RAW' ? 'Raw' : 'Active'}
                      </span>
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
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="Download PNG"
                      >
                        PNG ...
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
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchQRCodes(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
              >
                &lt; Previous
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchQRCodes(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm ${
                      pagination.page === pageNum
                        ? 'bg-pipo-blue text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => fetchQRCodes(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Generate QR Codes</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of QR Codes
                </label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={generateCount}
                  onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pipo-blue focus:border-transparent"
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
                className="px-4 py-2 rounded-lg bg-pipo-blue text-white hover:bg-pipo-blue/90 disabled:opacity-50 transition-colors"
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
