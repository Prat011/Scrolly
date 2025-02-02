"use client"

import { PdfViewer } from '../../../components/pdf-viewer/PdfViewer'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/supabase'
import { useRouter } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react'
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking dashboard session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error checking dashboard session:', sessionError)
          setError('Failed to check authentication status')
          return
        }

        if (!session) {
          console.log('No session found, redirecting to login...')
          router.replace('/auth/login')
          return
        }

        console.log('Valid session found:', session)
        setIsLoading(false)
      } catch (error) {
        console.error('Unexpected error in dashboard:', error)
        setError('An unexpected error occurred')
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Dashboard auth state changed:', event)
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/auth/login')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (isLoading) {
    setIsLoading(false)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <PdfViewer />
    </main>
  )
} 