'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login?callbackUrl=/tutor')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-pipo-green border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userName = session.user.name || session.user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/tutor" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-pipo-blue">PIPO</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-pipo-yellow text-gray-800 text-sm font-bold flex items-center justify-center">
                {userName.substring(0, 2).toUpperCase()}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-pipo-blue-bg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:mt-0 mt-[60px]`}
        >
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-4 border-b border-white/10">
              <Link
                href="/tutor"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/tutor'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-pipo-yellow flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-medium">{userName.toUpperCase()}</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <Link
                href="/tutor"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/tutor' || pathname.startsWith('/tutor/pet')
                    ? 'bg-pipo-yellow text-gray-800'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl">🐾</span>
                <span className="font-medium">My Pet Profile</span>
              </Link>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20 mt-[60px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
