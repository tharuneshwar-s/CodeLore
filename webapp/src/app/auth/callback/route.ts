import supabase from '@/utils/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  console.log('\n\n\nAuth callback URL:', request.url)
  console.log(searchParams, origin)
  
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        // Force using current origin for production, ignoring any site_url in the state parameter
        // This ensures the redirect stays on the current deployment URL, not localhost
        if (isLocalEnv) {
          // Local development - use the origin directly
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          // Production with forwarded host header (from load balancer/proxy)
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          // Production without forwarded host
          return NextResponse.redirect(`${origin}${next}`)
        }
      } else {
        console.error('Error exchanging code for session:', error)
      }
    } catch (err) {
      console.error('Authentication callback error:', err)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}