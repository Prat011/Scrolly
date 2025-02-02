import { createClient } from '../../../lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    await supabase.auth.exchangeCodeForSession(code)
    
    return NextResponse.redirect(new URL('/protected/dashboard', request.url))
  }

  // Return to login if code is missing
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
