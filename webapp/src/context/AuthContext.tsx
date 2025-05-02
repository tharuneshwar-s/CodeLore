'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session and set up listener
    const getInitialSession = async () => {
      setIsLoading(true);

      // Get current session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
      }

      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, changedSession) => {
          setSession(changedSession);
          setUser(changedSession?.user ?? null);
        }
      );

      setIsLoading(false);

      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    getInitialSession();
  }, []);

  const signIn = async () => {
    try {
      // Get the current origin from the browser window object
      let origin = '';
      
      // Only access window if we're in the browser
      if (typeof window !== 'undefined') {
        origin = window.location.origin;
      } else {
        // Fallback to environment variable for SSR
        origin = process.env.NEXT_PUBLIC_APP_URL || '';
      }
      
      console.log('Using site URL for authentication:', origin);
      
      // Make sure origin is not empty
      if (!origin) {
        console.error('Origin URL is empty. Please check NEXT_PUBLIC_APP_URL environment variable.');
        return;
      }
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${origin}/auth/callback`,
          scopes: 'repo', // Request repository access
        }
      });

      alert(`Redirecting to GitHub for authentication...,: ${error} and ${data}`,);

      if (error) {
        console.error('GitHub authentication error:', error);
      } else if (data?.url) {
        // Use window.location for client-side redirects instead of Next's redirect
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};