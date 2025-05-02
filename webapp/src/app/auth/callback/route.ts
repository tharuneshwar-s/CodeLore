import supabase from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }
      // Set Supabase session cookies for SSR
      const response = NextResponse.redirect(next);
      if (data?.session) {
        // Set cookies for access_token and refresh_token
        response.cookies.set({
          name: 'sb-access-token',
          value: data.session.access_token,
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        response.cookies.set({
          name: 'sb-refresh-token',
          value: data.session.refresh_token,
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
      return response;
    } catch (err) {
      console.error('Authentication callback error:', err);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }
  // If no code, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}