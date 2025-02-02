import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set() {
          // No-op: Cookie setting should be handled in Server Actions or Route Handlers
          return
        },
        remove() {
          // No-op: Cookie removal should be handled in Server Actions or Route Handlers
          return
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  )
}