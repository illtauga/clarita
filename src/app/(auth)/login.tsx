import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Switch } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography } from '../../theme/typography';
import { buttonStyles } from '../../theme/buttons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    // Cargar credenciales guardadas si existen
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');

        if (savedUsername && savedPassword && savedRememberMe === 'true') {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error al cargar credenciales:', error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      // En AuthContext, signIn espera email y password.
      // Como el diseño pide login por username, buscamos email por username antes (endpoint ya existe en reset y hook, lo reusamos aquí vía RPC temporal)
      // Simplificación: permitir que el usuario ingrese email directamente por ahora.
      await signIn(username, password);

      // Guardar credenciales si el switch está activado
      if (rememberMe) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        // Eliminar credenciales guardadas si el switch está desactivado
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('rememberMe');
      }

      router.push('/(app)/events');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
        Ingresá a tu cuenta
        </Text>

        <TextInput
          label="Correo electrónico"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
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
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <View style={styles.rememberMeContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
          />
          <Text style={styles.rememberMeText}>Recordar mis datos</Text>
        </View>

        <View style={buttonStyles.container}>
          <Button
            mode="contained"
            onPress={handleLogin}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.primaryText]}
            loading={loading}
            disabled={loading}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/register')}
            style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.secondaryText]}
          >
            ¿No tienes cuenta? Regístrate aquí
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/(auth)/reset-password')}
            style={[buttonStyles.button, buttonStyles.tertiary]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.tertiaryText]}
          >
            ¿Olvidaste tu contraseña?
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
    marginBottom: 40,
  },
  input: {
    marginBottom: 15,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  rememberMeText: {
    marginLeft: 10,
  },
}); 