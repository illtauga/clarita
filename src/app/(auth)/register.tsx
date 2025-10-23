import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, HelperText } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { buttonStyles } from '../../theme/buttons';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const result = await signUp(username, email, password);
      if (!result || !result.userId) {
        Alert.alert('Error', 'Ocurrió un error al registrar el usuario');
        return;
      }

      Alert.alert(
        'Registro exitoso',
        'Por favor verifica tu correo electrónico para activar tu cuenta',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
      </View>

      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Crear Cuenta
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
        No necesitás registrarte, pero si creás una cuenta tus eventos se guardan y podés volver a ellos desde cualquier lugar.
        </Text>

        <TextInput
          label="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => {}}
        />

        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => {}}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <HelperText type="info" style={styles.helperText}>
          La contraseña debe tener al menos 6 caracteres
        </HelperText>

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />

        <View style={buttonStyles.container}>
          <Button
            mode="contained"
            onPress={handleRegister}
            style={[buttonStyles.button, buttonStyles.primary]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.primaryText]}
            loading={loading}
            disabled={loading}
          >
            Registrarse
          </Button>

          <Button
            mode="text"
            onPress={() => {
              setLoading(false);
              router.push('/(auth)/login');
            }}
            style={[buttonStyles.button, buttonStyles.tertiary, buttonStyles.textMode]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.tertiaryText}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMedium,
    textAlign: 'left',
    marginBottom: 16,
  },
  description: {
    ...typography.bodyLarge,
    textAlign: 'left',
    marginBottom: 20,
    opacity: 0.7,
  },
  input: {
    marginBottom: 15,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  helperText: {
    marginTop: -10,
    marginBottom: 10,
  },
}); 