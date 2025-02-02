"use client"

import { PdfViewer } from '../pdf-viewer/PdfViewer'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugState, setDebugState] = useState<string>('Initial load')
  const router = useRouter()

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        setDebugState('Checking session...')
        console.log('Step 1: Starting session check')
        
        const sessionResponse = await supabase.auth.getSession()
        console.log('Step 2: Session response received:', sessionResponse)
        
        const { data: { session }, error: sessionError } = sessionResponse
        
        if (sessionError) {
          console.error('Step 3a: Session error:', sessionError)
          setDebugState(`Session error: ${sessionError.message}`)
          setError('Failed to check authentication status')
          return
        }

        if (!session) {
          console.log('Step 3b: No session found')
          setDebugState('No session - redirecting to login')
          window.location.href = '/auth/login'
          return
        }

        console.log('Step 4: Valid session found:', session)
        setDebugState('Session valid - loading complete')
        
        if (isMounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Step X: Unexpected error:', error)
        setDebugState(`Unexpected error: ${error}`)
        setError('An unexpected error occurred')
      }
    }

    console.log('Step 0: Component mounted')
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change detected:', event)
      setDebugState(`Auth state changed: ${event}`)
      
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/auth/login'
      }
    })

    return () => {
      isMounted = false;
      subscription?.unsubscribe()
    }
  }, [])

  // Debug display
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <div className="text-sm text-gray-600">Current state: {debugState}</div>
        {error && <div className="text-red-500">Error: {error}</div>}
        <div className="text-xs text-gray-400">Loading time: {Math.floor(Date.now() / 1000)}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-500">Error: {error}</div>
        <div className="text-sm text-gray-600">State: {debugState}</div>
        <button 
          onClick={() => window.location.href = '/auth/login'}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Return to Login
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <PdfViewer />
    </main>
  )
}