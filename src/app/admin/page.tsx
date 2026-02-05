'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalQRCodes: number
  rawQRCodes: number
  activeQRCodes: number
  totalPets: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-pipo-blue border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to PIPO Admin Panel</p>
        </div>
        <Link
          href="/admin/qrcodes"
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate QR Codes
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total QR Codes */}
        <div className="card bg-gradient-to-br from-pipo-blue to-pipo-blue-bg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Total QR Codes</p>
              <p className="text-4xl font-bold mt-2">{stats?.totalQRCodes || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Raw QR Codes */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Raw (Unregistered)</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{stats?.rawQRCodes || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active QR Codes */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active (Registered)</p>
              <p className="text-4xl font-bold text-pipo-green mt-2">{stats?.activeQRCodes || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-pipo-green-light flex items-center justify-center">
              <svg className="w-7 h-7 text-pipo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Pets */}
        <div className="card bg-gradient-to-br from-pipo-yellow to-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">Total Pets</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{stats?.totalPets || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-3xl">🐾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/qrcodes?action=generate"
            className="flex items-center gap-4 p-4 bg-pipo-blue-light rounded-xl hover:bg-pipo-blue/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-pipo-blue flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Generate QR Codes</p>
              <p className="text-sm text-gray-600">Create new QR codes</p>
            </div>
          </Link>

          <Link
            href="/admin/qrcodes?filter=raw"
            className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800">View Raw QR Codes</p>
              <p className="text-sm text-gray-600">Unregistered codes</p>
            </div>
          </Link>

          <Link
            href="/admin/qrcodes?filter=active"
            className="flex items-center gap-4 p-4 bg-pipo-green-light rounded-xl hover:bg-pipo-green/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-pipo-green flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800">View Active QR Codes</p>
              <p className="text-sm text-gray-600">Registered codes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
