'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { StarBorder } from '@/src/components/ui/star-border'

function VerifyComponent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white via-white to-white text-transparent bg-clip-text font-['Instrument_Serif']">
          Check Your Email
        </h1>
        
        <div className="w-full p-8 bg-white/5 backdrop-blur-sm rounded-xl shadow-xl space-y-6">
          <p className="text-gray-300 text-center font-['Instrument_Serif']">
            We've sent you a verification link. Please check your email to complete the signup process.
          </p>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <StarBorder
            type="button"
            onClick={() => window.location.href = '/auth/login'}
            className="w-full"
          >
            <span className="text-lg font-['Instrument_Serif']">Return to Login</span>
          </StarBorder>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyComponent />
    </Suspense>
  )
}
