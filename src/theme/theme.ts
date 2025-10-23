import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

export const fonts = {
  regular: Inter_400Regular,
  medium: Inter_500Medium,
  semiBold: Inter_600SemiBold,
  bold: Inter_700Bold,
  robotoRegular: Roboto_400Regular,
  robotoMedium: Roboto_500Medium,
  robotoBold: Roboto_700Bold,
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'Inter_400Regular',
    },
    medium: {
      fontFamily: 'Inter_500Medium',
    },
    bold: {
      fontFamily: 'Inter_700Bold',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    error: '#CF6679',
    background: '#121212',
    surface: '#121212',
    text: '#FFFFFF',
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    regular: {
      fontFamily: 'Inter_400Regular',
    },
    medium: {
      fontFamily: 'Inter_500Medium',
    },
    bold: {
      fontFamily: 'Inter_700Bold',
    },
  },
}; 