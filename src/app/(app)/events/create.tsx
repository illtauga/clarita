import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../../theme/typography';
import { buttonStyles } from '../../../theme/buttons';

const CreateEventScreen = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    // Validaciones
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (!date.trim()) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return;
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Formato de fecha inválido. Usa YYYY-MM-DD (ej: 2025-10-25)');
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        user_id: user?.id,
        title: title.trim(),
        description: description.trim() || null,
        date: date.trim(),
        total_cost: totalCost ? parseFloat(totalCost) : null,
        is_local: false,
      };

      const { error } = await supabase.from('events').insert(eventData);
      
      if (error) throw error;
      
      Alert.alert('¡Éxito!', 'El evento fue creado correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error al crear evento:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>Nuevo Evento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineMedium" style={styles.title}>
          Crear un Evento
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Organizá tu evento y después agregá participantes y aportes para que Clarita haga las cuentas.
        </Text>

        <TextInput
          label="Título del evento *"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          placeholder="ej: Asado del viernes"
          autoCapitalize="sentences"
          returnKeyType="done"
          onSubmitEditing={() => {}}
        />

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="ej: Juntada en lo de Juan para cenar"
          autoCapitalize="sentences"
          returnKeyType="done"
          onSubmitEditing={() => {}}
        />

        <TextInput
          label="Fecha del evento *"
          value={date}
          onChangeText={setDate}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
          returnKeyType="done"
          onSubmitEditing={() => {}}
        />
        <HelperText type="info" style={styles.helperText}>
          Formato: YYYY-MM-DD (ej: 2025-10-25)
        </HelperText>

        <TextInput
          label="Costo total estimado (opcional)"
          value={totalCost}
          onChangeText={setTotalCost}
          style={styles.input}
          mode="outlined"
          placeholder="ej: 5000"
          keyboardType="decimal-pad"
          left={<TextInput.Affix text="$" />}
          returnKeyType="done"
          onSubmitEditing={() => {}}
        />
        <HelperText type="info" style={styles.helperText}>
          Podés dejarlo vacío y completarlo después
        </HelperText>

        <View style={[buttonStyles.container, styles.buttonContainer]}>
          <Button
            mode="contained"
            onPress={handleCreateEvent}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
            loading={loading}
            disabled={loading}
            icon="calendar-plus"
          >
            Crear Evento
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
    </SafeAreaView>
  );
};

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
  input: {
    marginBottom: 4,
  },
  helperText: {
    marginTop: -4,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default CreateEventScreen; 