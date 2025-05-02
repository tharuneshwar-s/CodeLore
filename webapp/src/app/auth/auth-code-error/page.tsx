'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthCodeErrorPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  // Auto redirect after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <svg className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-6">Authentication Error</h1>
          <p className="text-slate-600 mt-3">
            We encountered an error while processing your authentication request.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-5 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Possible causes:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>The authentication session expired</li>
            <li>The authentication code was already used</li>
            <li>There was a problem with your GitHub authorization</li>
            <li>A network error interrupted the authentication process</li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-center text-slate-600">
            You'll be redirected to the homepage in <span className="font-semibold text-indigo-600">{countdown}</span> seconds
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return to Homepage
            </button>
            
            <button
              onClick={() => window.location.href = `${window.location.origin}`}
              className="px-6 py-3 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
            >
              Try Again
            </button>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-8">
            If you continue experiencing issues, please contact support or 
            <Link href="https://github.com/login/oauth/authorize" className="text-indigo-600 hover:text-indigo-800 ml-1">
              try signing in directly with GitHub
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}