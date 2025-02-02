"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/supabase'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext({})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        // Force refresh the session
        const { data: { session: refreshedSession } } = await supabase.auth.getSession()
        setUser(refreshedSession?.user ?? null as any)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}