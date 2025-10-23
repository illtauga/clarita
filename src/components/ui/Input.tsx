import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputContainerStyle,
  variant = 'default',
  size = 'medium',
  style,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.inputContainer,
      ...styles[`${size}InputContainer`],
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          ...styles.filledInputContainer,
          ...(isFocused && styles.filledFocused),
          ...(error && styles.filledError),
        };
      case 'outline':
        return {
          ...baseStyle,
          ...styles.outlineInputContainer,
          ...(isFocused && styles.outlineFocused),
          ...(error && styles.outlineError),
        };
      default:
        return {
          ...baseStyle,
          ...styles.defaultInputContainer,
          ...(isFocused && styles.defaultFocused),
          ...(error && styles.defaultError),
        };
    }
  };

  const getInputStyle = () => {
    return [
      styles.input,
      styles[`${size}Input`],
      style,
    ];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={[getInputContainerStyle(), inputContainerStyle]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          {...textInputProps}
          style={getInputStyle()}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.textSecondary}
        />
        
        {rightIcon && (
          <TouchableOpacity style={styles.iconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: theme.colors.text,
    marginBottom: 8,
  },
  labelError: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  // Variants
  defaultInputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    borderRadius: 0,
    paddingVertical: 8,
  },
  defaultFocused: {
    borderBottomColor: theme.colors.primary,
  },
  defaultError: {
    borderBottomColor: theme.colors.error,
  },
  filledInputContainer: {
    backgroundColor: `${theme.colors.primary}10`,
    paddingHorizontal: 16,
  },
  filledFocused: {
    backgroundColor: `${theme.colors.primary}15`,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  filledError: {
    backgroundColor: `${theme.colors.error}10`,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  outlineInputContainer: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
  },
  outlineFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  outlineError: {
    borderColor: theme.colors.error,
  },
  // Sizes
  smallInputContainer: {
    minHeight: 36,
  },
  mediumInputContainer: {
    minHeight: 48,
  },
  largeInputContainer: {
    minHeight: 56,
  },
  // Input
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text,
  },
  smallInput: {
    fontSize: 14,
  },
  mediumInput: {
    fontSize: 16,
  },
  largeInput: {
    fontSize: 18,
  },
  // Icons
  iconContainer: {
    marginHorizontal: 8,
  },
  // Helper text
  helperText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: theme.colors.error,
  },
});

