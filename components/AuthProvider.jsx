// components/AuthProvider.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to manually redirect based on auth state
  const redirectBasedOnAuth = (isAuthenticated) => {
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    } else if (!isAuthenticated && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      // Handle initial route protection
      redirectBasedOnAuth(!!data.session);
      
      setLoading(false);
    };

    initializeAuth();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Handle navigation based on auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Custom sign-in function that handles redirection
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Force redirect if the event listener doesn't catch it
      if (data.session) {
        router.push('/dashboard');
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  // Custom sign-up function that handles redirection
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      // Force redirect if the event listener doesn't catch it
      if (data.session) {
        router.push('/dashboard');
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Force redirect
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
