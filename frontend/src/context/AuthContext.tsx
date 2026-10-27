import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  loginAsDemo: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user-id-00000000-0000-0000-0000-000000000001',
  app_metadata: { provider: 'demo' },
  user_metadata: { full_name: 'Elena Rostova', travel_style: 'cultural' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'elena.rostova@tripora.example.com',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'demo-user-id-00000000-0000-0000-0000-000000000001',
  full_name: 'Elena Rostova',
  default_currency: 'USD',
  travel_style: 'balanced',
  dietary_preferences: ['Local Specialties', 'Vegetarian Friendly'],
  bio: 'Curious cultural explorer, coffee connoisseur, and photography enthusiast.',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Check initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        loadProfile(session.user);
      } else {
        // Check if demo user was active
        const storedDemo = localStorage.getItem('tripora_demo_session');
        if (storedDemo === 'true') {
          setUser(DEMO_USER);
          setIsDemoUser(true);
          setProfile(DEFAULT_PROFILE);
        }
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        setIsDemoUser(false);
        localStorage.removeItem('tripora_demo_session');
        loadProfile(session.user);
      } else if (!isDemoUser) {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (u: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single();
      
      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile
        setProfile({
          id: u.id,
          full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Traveler',
          default_currency: 'USD',
          travel_style: 'balanced',
          dietary_preferences: [],
        });
      }
    } catch {
      setProfile({
        id: u.id,
        full_name: u.user_metadata?.full_name || 'Traveler',
        default_currency: 'USD',
        travel_style: 'balanced',
        dietary_preferences: [],
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    return { error: res.error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    setIsLoading(false);
    return { error: res.error as Error | null };
  };

  const signOut = async () => {
    setIsLoading(true);
    localStorage.removeItem('tripora_demo_session');
    setIsDemoUser(false);
    setUser(null);
    setSession(null);
    setProfile(null);
    await supabase.auth.signOut().catch(() => {});
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    const res = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: res.error as Error | null };
  };

  const loginAsDemo = () => {
    localStorage.setItem('tripora_demo_session', 'true');
    setUser(DEMO_USER);
    setIsDemoUser(true);
    setProfile(DEFAULT_PROFILE);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (isDemoUser) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return;
    }
    if (!user) return;
    try {
      await supabase.from('profiles').update(updates).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        loginAsDemo,
        updateProfile,
      }}
    >
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
