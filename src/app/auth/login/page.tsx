// pages/auth/login.tsx
"use client"

import { supabase } from '../../../lib/supabase/supabase'
import { useState } from 'react'
import { RainbowButton } from '@/src/components/ui/rainbow-button'

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
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white-900 via-white-900 to-white-900 text-transparent bg-clip-text">
        </h1>
        
        <div className="w-full p-8 bg-white/5 backdrop-blur-sm rounded-xl shadow-xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
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
            
            <RainbowButton 
              type="submit" 
              className="w-full relative group"
              disabled={loading}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  {loading ? 'Loading...' : 'Sign In'}
            </RainbowButton>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0c0c0c] text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = '/auth/signup'}
              className="w-full text-sm text-gray-300 hover:text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>Need an account?</span>
              <span className="font-semibold">Sign Up →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}