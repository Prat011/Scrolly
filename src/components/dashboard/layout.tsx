import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { cookies } from 'next/headers'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Session error:', error)
    redirect('/auth/login?error=session_error')
  }

  if (!session) {
    console.log('No session found in protected layout')
    redirect('/auth/login?error=no_session')
  }

  return <>{children}</>
}