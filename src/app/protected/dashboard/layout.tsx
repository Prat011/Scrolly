"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase/supabase'
import { Session } from '@supabase/supabase-js'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (!currentSession) {
          router.replace('/auth/login')
          return
        }
        
        setSession(currentSession)
      } catch (error) {
        console.error("Session check error:", error)
        router.replace('/auth/login')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      
      setSession(session)
      setLoading(false)
      
      if (!session) {
        router.replace('/auth/login')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

export function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}