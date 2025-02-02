import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Force refresh the session
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Middleware session error:', error)
    // Clear invalid session
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/auth/login?error=middleware_error', req.url))
  }

  // Handle protected routes
  if (!session && req.nextUrl.pathname.startsWith('/protected')) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/protected/:path*',
    '/auth/login',
    '/auth/signup',
    '/api/auth/supabase'
  ]
}
