import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, IconButton } from 'react-native-paper';
import { typography } from '../theme/typography';
import { buttonStyles } from '../theme/buttons';

interface AddParticipantModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (name: string) => Promise<void>;
}

export default function AddParticipantModal({ visible, onDismiss, onAdd }: AddParticipantModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onAdd(name.trim());
      setName('');
      onDismiss();
    } catch (error) {
      console.error('Error adding participant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Agregar Participante
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={handleCancel}
          />
        </View>

        <ScrollView style={styles.content}>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Agregá una persona que va a participar en el evento
          </Text>

          <TextInput
            label="Nombre del participante *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            placeholder="ej: Juan Pérez"
            autoCapitalize="words"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </ScrollView>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined, styles.actionButton]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.secondaryText}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            mode="contained"
            onPress={handleAdd}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained, styles.actionButton]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
            loading={loading}
            disabled={loading || !name.trim()}
            icon="account-plus"
          >
            Agregar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...typography.titleLarge,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  subtitle: {
    ...typography.bodyLarge,
    opacity: 0.7,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginBottom: 0,
  },
});

