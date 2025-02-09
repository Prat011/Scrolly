import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
      }

      // Redirect to verification success page
      return NextResponse.redirect(new URL('/auth/verification-success', request.url))
    }

    return NextResponse.redirect(new URL('/auth/login', request.url))
  } catch (error) {
    console.error('Route handler error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url))
  }
}