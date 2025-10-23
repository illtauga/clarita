import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, IconButton, Button, Card, Chip, ActivityIndicator, Menu } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../../theme/typography';
import { buttonStyles } from '../../../theme/buttons';
import { supabase } from '../../../lib/supabase';
import { Event } from '../../../types/supabase';
import AddParticipantModal from '../../../components/AddParticipantModal';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
    fetchParticipants();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, total_cost, user_id, is_local, created_at, updated_at')
        .eq('id', id)
        .single();
      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      Alert.alert('Error', 'No se pudo cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('id, name, created_at')
        .eq('event_id', id);
      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleAddParticipant = async (name: string) => {
    try {
      const { error } = await supabase.from('participants').insert({
        event_id: id as string,
        name,
        user_id: null,
      });

      if (error) throw error;

      await fetchParticipants();
      Alert.alert('¡Éxito!', `${name} fue agregado al evento`);
    } catch (error: any) {
      console.error('Error adding participant:', error);
      Alert.alert('Error', 'No se pudo agregar el participante');
    }
  };

  const handleDeleteParticipant = async (participantId: string, participantName: string) => {
    Alert.alert(
      'Eliminar participante',
      `¿Estás seguro de que deseas eliminar a ${participantName}? Se eliminarán también todos sus aportes.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('participants')
                .delete()
                .eq('id', participantId);

              if (error) throw error;

              await fetchParticipants();
              setMenuVisible(null);
            } catch (error) {
              console.error('Error deleting participant:', error);
              Alert.alert('Error', 'No se pudo eliminar el participante');
            }
          },
        },
      ]
    );
  };

  const handleViewContributions = () => {
    router.push(`/(app)/events/${id}/contributions`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="titleLarge" style={styles.headerTitle}>Detalle del Evento</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando evento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="titleLarge" style={styles.headerTitle}>Detalle del Evento</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium">No se encontró el evento</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.backButton}>
            Volver a eventos
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.headerTitle}>Detalle del Evento</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Información principal */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              {event.title}
            </Text>
            
            {event.description && (
              <Text variant="bodyLarge" style={styles.description}>
                {event.description}
              </Text>
            )}

            <View style={styles.infoRow}>
              <Chip icon="calendar" style={styles.chip}>
                {new Date(event.date).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Chip>
            </View>

            {event.total_cost && (
              <View style={styles.infoRow}>
                <Chip icon="currency-usd" style={styles.chip}>
                  Presupuesto: ${event.total_cost.toFixed(2)}
                </Chip>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Sección de Participantes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Participantes
            </Text>
            <Button 
              mode="contained-tonal" 
              icon="account-plus" 
              onPress={() => setShowAddModal(true)}
              compact
            >
              Agregar
            </Button>
          </View>

          {participants.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  Aún no hay participantes en este evento
                </Text>
                <Text style={styles.emptySubtext}>
                  Agregá personas para empezar a registrar aportes
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                {participants.map((participant, index) => (
                  <View key={participant.id}>
                    <View style={styles.participantRow}>
                      <View style={styles.participantInfo}>
                        <Chip icon="account" style={styles.participantChip}>
                          {participant.name}
                        </Chip>
                      </View>
                      <Menu
                        visible={menuVisible === participant.id}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                          <IconButton
                            icon="dots-vertical"
                            size={20}
                            onPress={() => setMenuVisible(participant.id)}
                          />
                        }
                      >
                        <Menu.Item
                          leadingIcon="delete"
                          onPress={() => handleDeleteParticipant(participant.id, participant.name)}
                          title="Eliminar"
                        />
                      </Menu>
                    </View>
                    {index < participants.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Botones de acción */}
        <View style={[buttonStyles.container, styles.actionsContainer]}>
          <Button
            mode="contained"
            icon="cash-multiple"
            onPress={handleViewContributions}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
          >
            Ver Aportes y Balances
          </Button>
        </View>
      </ScrollView>

      <AddParticipantModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
        onAdd={handleAddParticipant}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    ...typography.bodyLarge,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ECE6F0',
    elevation: 2,
  },
  title: {
    ...typography.headlineMedium,
    marginBottom: 12,
  },
  description: {
    ...typography.bodyLarge,
    opacity: 0.7,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  section: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.titleLarge,
  },
  emptyCard: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    textAlign: 'center',
    opacity: 0.7,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  participantInfo: {
    flex: 1,
  },
  participantChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  actionsContainer: {
    marginTop: 8,
  },
}); 