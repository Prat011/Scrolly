"use client"

import { Suspense } from 'react'
import { AuthForm } from '../../../components/auth/AuthForm'

function LoginComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white via-white to-white text-transparent bg-clip-text font-['Instrument_Serif']">
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  )
}