'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-header min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Pet Images */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80"
            alt="Happy dog background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="p-6 relative z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐾</span>
              <span className="text-2xl font-bold text-pipo-yellow">PIPO</span>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link
                  href={session.user.role === 'ADMIN' ? '/admin' : '/tutor'}
                  className="btn btn-warning"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-pipo-yellow transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-warning"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Help Lost Pets<br />
                <span className="text-pipo-yellow">Find Their Way Home</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl">
                PIPO is a smart QR code system that connects your pet with anyone who finds them.
                One scan, instant contact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="btn btn-warning text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <span>🐾</span>
                  Register Your Pet
                </Link>
                <a
                  href="#how-it-works"
                  className="btn bg-white/20 text-white hover:bg-white/30 text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  Learn More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Hero Image - Happy Pet */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-pipo-yellow rounded-full opacity-30 blur-3xl"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"
                    alt="Happy dog with collar"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* QR Code Badge */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center transform rotate-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-3 0h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm2 0h1v1h-1v-1zm0 2h1v1h-1v-1zm-3 0h1v1h-1v-1zm1 1h1v1h-1v-1zm2 0h3v1h-3v-1z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="h-20 bg-white relative z-10" style={{
          clipPath: 'ellipse(70% 100% at 50% 100%)',
          marginTop: '-80px'
        }} />
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Simple, fast, and effective. PIPO connects finders with pet owners in seconds.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80"
                  alt="Dog wearing collar with tag"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pipo-blue/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full text-pipo-blue font-bold text-lg">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Get a PIPO Tag</h3>
              <p className="text-gray-600">
                Attach a PIPO QR code tag to your pet&apos;s collar and register their information.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80"
                  alt="Person with dog outdoors"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pipo-green/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full text-pipo-green font-bold text-lg">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Someone Finds Your Pet</h3>
              <p className="text-gray-600">
                The finder scans the QR code with their smartphone camera.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80"
                  alt="Happy reunion with pet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pipo-yellow/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full text-amber-600 font-bold text-lg">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Reunion</h3>
              <p className="text-gray-600">
                The finder sees your pet&apos;s info and contacts you directly via WhatsApp or phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Why Choose PIPO?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pipo-blue-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pipo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Instant Contact</h3>
              <p className="text-gray-600 text-sm">
                No app needed. One scan connects finder to owner.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pipo-green-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pipo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Privacy Control</h3>
              <p className="text-gray-600 text-sm">
                You choose what information to display publicly.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pipo-yellow-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Easy Updates</h3>
              <p className="text-gray-600 text-sm">
                Update your pet&apos;s info anytime from your account.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Works Anywhere</h3>
              <p className="text-gray-600 text-sm">
                100% web-based. Works on any smartphone with a camera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-header text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80"
            alt="Happy pets background"
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Pet Images Grid */}
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30">
                  <Image
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80"
                    alt="Cat portrait"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80"
                    alt="Golden retriever"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 -mt-4">
                  <Image
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80"
                    alt="Cute dog"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 mt-4">
                  <Image
                    src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&q=80"
                    alt="Tabby cat"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* CTA Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Protect Your Pet Today
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of pet owners who trust PIPO to keep their furry friends safe.
                Because every pet deserves to find their way back home.
              </p>
              <Link
                href="/register"
                className="btn btn-warning text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <span>🐾</span>
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-pipo-yellow">PIPO</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 PIPO - Pet Identification System. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
