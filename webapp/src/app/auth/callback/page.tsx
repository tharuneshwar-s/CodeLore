'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        // Exchange the code for a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Check if we have a session
        if (data?.session) {
          // User is signed in, redirect to home page
          router.push('/');
        } else {
          setError('No session found after authentication.');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-slate-700">Completing GitHub authentication...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-red-800">Authentication error</p>
            <p className="mt-2 text-slate-600">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="mt-4 text-lg font-medium text-green-800">Authentication successful!</p>
            <p className="mt-2 text-slate-600">Redirecting you back to the application...</p>
          </div>
        )}
      </div>
    </div>
  );
}