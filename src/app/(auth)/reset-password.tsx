import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { buttonStyles } from '../../theme/buttons';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPassword() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError(null);
      await resetPassword(username);
      setSuccess(true);
    } catch (err: any) {
      // No mostramos el error real por seguridad
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <Text variant="headlineMedium" style={styles.title}>
            Solicitud Enviada
          </Text>
          
          <Text variant="bodyMedium" style={styles.description}>
            Si el usuario existe en nuestro sistema, recibirás un correo electrónico con las instrucciones para restablecer tu contraseña.
          </Text>

          <Button
            mode="contained"
            onPress={() => router.back()}
            style={[buttonStyles.button, buttonStyles.primary]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.primaryText]}
          >
            Volver al inicio de sesión
          </Button>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text variant="headlineMedium" style={styles.title}>
          Recuperar Contraseña
        </Text>
        
        <Text variant="bodyMedium" style={styles.description}>
          Ingresa tu nombre de usuario y te enviaremos un enlace para restablecer tu contraseña.
        </Text>

        <TextInput
          label="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={buttonStyles.container}>
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={[buttonStyles.button, buttonStyles.primary]}
            contentStyle={buttonStyles.content}
            labelStyle={[typography.buttonLarge, buttonStyles.text, buttonStyles.primaryText]}
            loading={loading}
            disabled={loading}
          >
            Enviar enlace
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
    marginBottom: 30,
  },
  description: {
    ...typography.bodyLarge,
    textAlign: 'left',
    marginBottom: 20,
    opacity: 0.7,
  },
  input: {
    marginBottom: 30,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
}); 