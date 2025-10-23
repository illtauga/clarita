import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const LOCAL_MODE_KEY = 'isLocalMode';

type LocalModeContextType = {
  isLocalMode: boolean;
  enableLocalMode: () => void;
  disableLocalMode: () => void;
};

const LocalModeContext = createContext<LocalModeContextType | undefined>(undefined);

export function LocalModeProvider({ children }: { children: React.ReactNode }) {
  const [isLocalMode, setIsLocalMode] = useState<boolean>(false);

  useEffect(() => {
    // Cargar el estado inicial
    const loadLocalMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(LOCAL_MODE_KEY);
        setIsLocalMode(savedMode === 'true');
      } catch (error) {
        console.error('Error loading local mode:', error);
      }
    };
    loadLocalMode();
  }, []);

  useEffect(() => {
    // Guardar el estado cuando cambia
    const saveLocalMode = async () => {
      try {
        await AsyncStorage.setItem(LOCAL_MODE_KEY, String(isLocalMode));
      } catch (error) {
        console.error('Error saving local mode:', error);
      }
    };
    saveLocalMode();
  }, [isLocalMode]);

  const enableLocalMode = () => {
    setIsLocalMode(true);
    router.replace('/(local)/home');
  };

  const disableLocalMode = () => {
    setIsLocalMode(false);
    router.replace('/(auth)/welcome');
  };

  const value = {
    isLocalMode,
    enableLocalMode,
    disableLocalMode,
  };

  return (
    <LocalModeContext.Provider value={value}>
      {children}
    </LocalModeContext.Provider>
  );
}

export function useLocalMode() {
  const context = useContext(LocalModeContext);
  if (context === undefined) {
    throw new Error('useLocalMode must be used within a LocalModeProvider');
  }
  return context;
} 