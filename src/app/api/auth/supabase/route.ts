import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/protected/dashboard'

    if (code) {
      const cookieStore = cookies()
      console.log('Cookie store:', cookieStore)
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
      }

      // Force refresh the session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login?error=no_session', request.url))
      }

      // Add a small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 500))

      return NextResponse.redirect(new URL(next, request.url))
    }

    return NextResponse.redirect(new URL('/auth/login', request.url))
  } catch (error) {
    console.error('Route handler error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url))
  }
}