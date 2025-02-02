"use client"

import { supabase } from '../../lib/supabase/supabase'
import { FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { RainbowButton } from '@/src/components/ui/rainbow-button'

interface AuthFormProps {
  mode?: 'login' | 'signup';
  checkSession?: boolean;
}

export function AuthForm({ mode = 'login', checkSession = true }: AuthFormProps) {
  const [origin, setOrigin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const router = useRouter()

  useEffect(() => {
    const checkUserSession = async () => {
      if (!checkSession) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking session:', error)
          return
        }

        if (session) {
          console.log('Existing session found:', session)
          console.log('Redirecting to:', next || '/protected/dashboard')
          window.location.href = next || '/protected/dashboard'
        } else {
          console.log('No existing session found')
        }
      } catch (error) {
        console.error('Unexpected error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!origin) {
      setOrigin(window.location.origin)
    }

    checkUserSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      console.log('Session:', session)

      if (event === 'SIGNED_IN' && session) {
        try {
          console.log('Signed in, redirecting to:', next || '/protected/dashboard')
          // Force a hard navigation
          window.location.href = next || '/protected/dashboard'
        } catch (error) {
          console.error('Error during redirect:', error)
        }
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [next, origin, checkSession])

  useEffect(() => {
    setIsSignUp(mode === 'signup')
  }, [mode])

  const handleSignUp = async (email: string, password: string) => {
    try {
      const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || `${origin}/auth/verify`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('Signup error:', error)
        router.push('/auth/signup?error=signup_failed')
        return
      }

      console.log('Signup successful:', data)
      router.push('/auth/verify')
    } catch (error) {
      console.error('Unexpected signup error:', error)
      router.push('/auth/signup?error=unexpected_error')
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Signin attempt...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Signin error:', error)
        router.push('/auth/login?error=signin_failed')
        return
      }

      console.log('Signin successful:', data)
      console.log('Redirecting to:', next || '/protected/dashboard')
      // Force a hard navigation
      window.location.href = next || '/protected/dashboard'
    } catch (error) {
      console.error('Unexpected signin error:', error)
      router.push('/auth/login?error=unexpected_error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      await handleSignUp(email, password)
    } else {
      await handleSignIn(email, password)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-black/80 backdrop-blur-sm rounded-xl shadow-xl">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
            placeholder="••••••••"
            required
          />
        </div>

        <RainbowButton
          type="submit"
          className="w-full relative group"
          disabled={isLoading}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </RainbowButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black/80 text-gray-300">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-white/80 via-white/80 to-white/80 bg-clip-text text-transparent hover:opacity-80"
        >
          {isSignUp ? (
            <>
              <span>Already have an account?</span>
              <span className="font-semibold">Sign In →</span>
            </>
          ) : (
            <>
              <span>Need an account?</span>
              <span className="font-semibold">Sign Up →</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}