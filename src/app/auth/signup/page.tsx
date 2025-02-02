'use client'

import React, { Suspense } from 'react'
import { AuthForm } from '../../../components/auth/AuthForm'
import { useSearchParams } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react'

function SignupComponent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg backdrop-blur-sm">
            {error === 'auth_failed' && 'Authentication failed. Please try again.'}
            {error === 'no_session' && 'Session not found. Please try again.'}
            {error === 'server_error' && 'Server error. Please try again later.'}
          </div>
        )}

          <AuthForm mode="signup" checkSession={false} />
          

        </div>
      </div>
  )
}

export default function SignupPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupComponent />
      </Suspense>
      <Analytics />
    </>
  )
}