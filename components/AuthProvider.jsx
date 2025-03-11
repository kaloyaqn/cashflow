// components/AuthProvider.jsx
'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    session: null,
    loading: true,
    initialized: false
  });

  // Initialize auth only once
  useEffect(() => {
    if (state.initialized) return;

    console.log("AuthProvider initializing...");
    
    // Get current session
    const initializeAuth = async () => {
      try {
        // Check for existing session in localStorage first to avoid flash of unauthenticated content
        const cachedSession = localStorage.getItem('supabase_auth_state');
        if (cachedSession) {
          try {
            const parsed = JSON.parse(cachedSession);
            if (parsed?.session?.expires_at && new Date(parsed.session.expires_at * 1000) > new Date()) {
              console.log("Using cached auth state");
              setState({
                user: parsed.session?.user || null,
                session: parsed.session,
                loading: false,
                initialized: true
              });
              return;
            }
          } catch (e) {
            console.warn("Failed to parse cached session", e);
          }
        }

        // If no valid cached session, fetch from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setState(prev => ({ ...prev, loading: false, initialized: true }));
        } else {
          console.log("Session fetched:", !!data.session);
          
          // Cache the session
          if (data.session) {
            localStorage.setItem('supabase_auth_state', JSON.stringify(data));
          }
          
          setState({
            user: data.session?.user || null,
            session: data.session,
            loading: false,
            initialized: true
          });
        }
      } catch (e) {
        console.error("Unexpected error in initializeAuth:", e);
        setState(prev => ({ ...prev, loading: false, initialized: true }));
      }
    };

    initializeAuth();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        
        // Update cache
        if (newSession) {
          localStorage.setItem('supabase_auth_state', JSON.stringify({ session: newSession }));
        } else {
          localStorage.removeItem('supabase_auth_state');
        }
        
        setState({
          user: newSession?.user || null,
          session: newSession,
          loading: false,
          initialized: true
        });
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [state.initialized]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAuthenticated: !!state.user,
    
    // Add auth methods here so components don't need to import supabase
    signIn: (email, password) => 
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    signUp: (email, password) => 
      supabase.auth.signUp({ email, password })
  }), [state.user, state.session, state.loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
