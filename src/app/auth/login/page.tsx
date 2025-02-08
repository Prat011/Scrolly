// pages/auth/login.tsx
"use client"

import { supabase } from '../../../lib/supabase/supabase'
import { useState } from 'react'
import { StarBorder } from '@/src/components/ui/star-border'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Simple redirect
    window.location.href = '/protected/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white via-white to-white text-transparent bg-clip-text font-['Instrument_Serif']">
          Welcome Back
        </h1>
        
        <div className="w-full p-8 bg-white/5 backdrop-blur-sm rounded-xl shadow-xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 font-['Instrument_Serif']">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 font-['Instrument_Serif']"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 font-['Instrument_Serif']">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                required
              />
            </div>
            
            <StarBorder type="submit" className="w-full" disabled={loading}>
              <span className="text-lg font-['Instrument_Serif']">{loading ? 'Loading...' : 'Sign In'}</span>
            </StarBorder>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0c0c0c] text-gray-400">or</span>
              </div>
            </div>

            <StarBorder
              type="button"
              onClick={() => window.location.href = '/auth/signup'}
              className="w-full"
            >
              <span className="text-lg font-['Instrument_Serif']">Need an account? Sign Up →</span>
            </StarBorder>
          </form>
        </div>
      </div>
    </div>
  )
}