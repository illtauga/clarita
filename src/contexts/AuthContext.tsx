import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AUTH_EMAIL_REDIRECT_URL, RESET_PASSWORD_REDIRECT_URL } from '@env';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<{ userId: string }>;
  signOut: () => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    // Si el identificador parece un email, úsalo directo; si no, buscar email por username vía RPC
    const isEmail = identifier.includes('@');
    let emailToUse = identifier;

    if (!isEmail) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_email_by_username', {
        p_username: identifier,
      });
      if (rpcError) throw rpcError;
      if (!resolvedEmail) throw new Error('Usuario no encontrado');
      emailToUse = resolvedEmail as string;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (username: string, email: string, password: string) => {
    // Crear en Auth con metadatos
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
        },
        emailRedirectTo: AUTH_EMAIL_REDIRECT_URL || 'clarita://auth-redirect',
      },
    });
    if (authError) throw authError;

    const newUserId = authData.user?.id;
    if (!newUserId) throw new Error('No se recibió el usuario de Supabase');

    // La inserción en public.users la hará un trigger en Supabase (ver SQL recomendado)
    return { userId: newUserId };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (username: string) => {
    try {
      // Buscar email por username mediante RPC (evita RLS en modo anon)
      const { data: resolvedEmail } = await supabase.rpc('get_email_by_username', {
        p_username: username,
      });
      if (!resolvedEmail) return;

      // Luego enviar el email de recuperación
      const { error } = await supabase.auth.resetPasswordForEmail(resolvedEmail as string, {
        redirectTo: RESET_PASSWORD_REDIRECT_URL || 'clarita://reset-password',
      });
      if (error) {
        // No lanzamos error por seguridad
        return;
      }
    } catch (error) {
      // No lanzamos error por seguridad
      return;
    }
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user?.user_metadata,
        ...data,
      },
    });
    if (error) throw error;
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 