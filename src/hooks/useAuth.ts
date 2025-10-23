import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { User } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { RootState } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setUser(session.user));
      }
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user || null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signIn = async (username: string, password: string) => {
    try {
      dispatch(setLoading(true));
      
      // Primero obtener el email asociado al username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('full_name', username)
        .single();

      if (userError) {
        console.error('Error al buscar usuario:', userError);
        throw new Error('Error al buscar usuario');
      }
      
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Luego iniciar sesión con el email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión');
        }
        throw error;
      }
      return data;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      
      // Verificar si el username ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('Este nombre de usuario ya está en uso');
      }

      // Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: username,
          },
        },
      });
      
      if (authError) {
        console.error('Error en signUp:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Error al crear el usuario: no se recibió el usuario');
      }

      console.log('Usuario creado en Auth:', authData.user);
      return authData;
    } catch (error: any) {
      console.error('Error completo en signUp:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    try {
      dispatch(setLoading(true));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { signIn, signUp, signOut, user, isAuthenticated };
}; 