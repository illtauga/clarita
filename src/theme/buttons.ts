import { StyleSheet } from 'react-native';
import { MD3LightTheme } from 'react-native-paper';
import { typography } from './typography';

export const buttonStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
    width: '100%',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: MD3LightTheme.colors.primary,
    elevation: 2,
  },
  primaryText: {
    color: MD3LightTheme.colors.onPrimary,
    ...typography.buttonLarge,
  },
  secondary: {
    borderColor: MD3LightTheme.colors.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    elevation: 0,
  },
  secondaryText: {
    color: MD3LightTheme.colors.primary,
    ...typography.buttonLarge,
  },
  tertiary: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tertiaryText: {
    color: MD3LightTheme.colors.primary,
    ...typography.buttonLarge,
  },
  content: {
    height: 48,
  },
  text: {
    fontFamily: 'Poppins-Medium',
  },
  linkWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  contained: {
    borderRadius: 10,
  },
  outlined: {
    borderRadius: 10,
  },
  textMode: {
    borderRadius: 10,
  },
}); 