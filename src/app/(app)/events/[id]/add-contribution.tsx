import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, HelperText } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../../../theme/typography';
import { buttonStyles } from '../../../../theme/buttons';
import { supabase } from '../../../../lib/supabase';

export default function AddContributionScreen() {
  const { id, participantId, participantName } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContribution = async () => {
    // Validaciones
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresá un monto válido mayor a 0');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.from('contributions').insert({
        participant_id: participantId as string,
        description: description.trim(),
        amount: parseFloat(amount),
      });

      if (error) throw error;

      Alert.alert('¡Éxito!', 'El aporte fue agregado correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding contribution:', error);
      Alert.alert('Error', error.message || 'No se pudo agregar el aporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.headerTitle}>Nuevo Aporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="headlineMedium" style={styles.title}>
            Agregar Aporte
          </Text>

          <Text variant="bodyLarge" style={styles.subtitle}>
            Registrá un aporte de <Text style={styles.participantName}>{participantName}</Text>
          </Text>

          <TextInput
            label="Descripción del aporte *"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            placeholder="ej: Compra de bebidas"
            autoCapitalize="sentences"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {}}
          />
          <HelperText type="info" style={styles.helperText}>
            ¿Qué compró o aportó esta persona?
          </HelperText>

          <TextInput
            label="Monto *"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            mode="outlined"
            placeholder="ej: 2500"
            keyboardType="decimal-pad"
            left={<TextInput.Affix text="$" />}
            returnKeyType="done"
            onSubmitEditing={() => {}}
          />
          <HelperText type="info" style={styles.helperText}>
            ¿Cuánto gastó en este aporte?
          </HelperText>

          <View style={[buttonStyles.container, styles.buttonContainer]}>
            <Button
              mode="contained"
              onPress={handleAddContribution}
              style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
              contentStyle={buttonStyles.content}
              labelStyle={buttonStyles.primaryText}
              loading={loading}
              disabled={loading}
              icon="plus"
            >
              Agregar Aporte
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
              contentStyle={buttonStyles.content}
              labelStyle={buttonStyles.secondaryText}
              disabled={loading}
            >
              Cancelar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: {
    ...typography.titleLarge,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    ...typography.headlineMedium,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.bodyLarge,
    opacity: 0.7,
    marginBottom: 24,
  },
  participantName: {
    fontWeight: 'bold',
    color: '#4F378A',
  },
  input: {
    marginBottom: 4,
  },
  helperText: {
    marginTop: -4,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

