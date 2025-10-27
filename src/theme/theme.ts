import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

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
      fontFamily: 'Poppins-Regular',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
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
      fontFamily: 'Poppins-Regular',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
    },
  },
}; 