'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';

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
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
          scopes: 'repo' // Request repository access
        }
      });
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