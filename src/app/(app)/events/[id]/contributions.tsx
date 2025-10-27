import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, IconButton, Button, Card, FAB, List, Divider, Menu } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../../../theme/typography';
import { buttonStyles } from '../../../../theme/buttons';
import { supabase } from '../../../../lib/supabase';
import { Participant, Contribution } from '../../../../types/supabase';

interface ParticipantWithContributions extends Participant {
  contributions: Contribution[];
  total: number;
}

export default function ContributionsScreen() {
  const { id } = useLocalSearchParams();
  const [participants, setParticipants] = useState<ParticipantWithContributions[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchParticipantsAndContributions();
  }, [id]);

  const fetchParticipantsAndContributions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('event_id', id);

      if (participantsError) throw participantsError;

      // Fetch contributions for all participants
      const participantsWithContributions = await Promise.all(
        (participantsData || []).map(async (participant) => {
          const { data: contributions, error: contributionsError } = await supabase
            .from('contributions')
            .select('*')
            .eq('participant_id', participant.id);

          if (contributionsError) throw contributionsError;

          const total = (contributions || []).reduce((sum, c) => sum + Number(c.amount), 0);

          return {
            ...participant,
            contributions: contributions || [],
            total,
          };
        })
      );

      setParticipants(participantsWithContributions);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'No se pudieron cargar los aportes');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAddContribution = (participantId: string, participantName: string) => {
    router.push({
      pathname: '/(app)/events/[id]/add-contribution',
      params: { 
        id: id as string,
        participantId,
        participantName,
      },
    });
  };

  const handleDeleteContribution = async (contributionId: string) => {
    Alert.alert(
      'Eliminar aporte',
      '¿Estás seguro de que deseas eliminar este aporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('contributions')
                .delete()
                .eq('id', contributionId);

              if (error) throw error;

              await fetchParticipantsAndContributions();
              setMenuVisible(null);
            } catch (error) {
              console.error('Error deleting contribution:', error);
              Alert.alert('Error', 'No se pudo eliminar el aporte');
            }
          },
        },
      ]
    );
  };

  const totalGeneral = participants.reduce((sum, p) => sum + p.total, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.headerTitle}>Aportes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.totalLabel}>Total Aportado</Text>
            <Text variant="headlineLarge" style={styles.totalAmount}>
              ${totalGeneral.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        {participants.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No hay participantes en este evento
              </Text>
              <Text style={styles.emptySubtext}>
                Agrega participantes desde el detalle del evento
              </Text>
            </Card.Content>
          </Card>
        ) : (
          participants.map((participant) => (
            <Card key={participant.id} style={styles.participantCard}>
              <Card.Content>
                <View style={styles.participantHeader}>
                  <Text variant="titleMedium">{participant.name}</Text>
                  <Text variant="titleSmall" style={styles.participantTotal}>
                    ${participant.total.toFixed(2)}
                  </Text>
                </View>

                {participant.contributions.length === 0 ? (
                  <Text style={styles.noContributions}>
                    Sin aportes aún
                  </Text>
                ) : (
                  <View style={styles.contributionsList}>
                    {participant.contributions.map((contribution, index) => (
                      <View key={contribution.id}>
                        {index > 0 && <Divider style={styles.divider} />}
                        <View style={styles.contributionRow}>
                          <View style={styles.contributionInfo}>
                            <Text variant="bodyMedium">{contribution.description}</Text>
                            <Text variant="bodyLarge" style={styles.contributionAmount}>
                              ${Number(contribution.amount).toFixed(2)}
                            </Text>
                          </View>
                          <Menu
                            visible={menuVisible === contribution.id}
                            onDismiss={() => setMenuVisible(null)}
                            anchor={
                              <IconButton
                                icon="dots-vertical"
                                size={20}
                                onPress={() => setMenuVisible(contribution.id)}
                              />
                            }
                          >
                            <Menu.Item
                              leadingIcon="delete"
                              onPress={() => handleDeleteContribution(contribution.id)}
                              title="Eliminar"
                            />
                          </Menu>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <Button
                  mode="text"
                  icon="plus"
                  onPress={() => handleAddContribution(participant.id, participant.name)}
                  style={styles.addButton}
                >
                  Agregar aporte
                </Button>
              </Card.Content>
            </Card>
          ))
        )}

        <View style={[buttonStyles.container, styles.actionsContainer]}>
          <Button
            mode="contained"
            icon="calculator"
            onPress={() => router.push(`/(app)/events/${id}/results`)}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
            disabled={totalGeneral === 0}
          >
            Calcular y Ver Resultados
          </Button>
        </View>
      </ScrollView>
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
  totalCard: {
    marginBottom: 24,
    backgroundColor: '#E9D5FF',
    elevation: 3,
  },
  totalLabel: {
    opacity: 0.8,
    marginBottom: 4,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#4F378A',
  },
  emptyCard: {
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
  participantCard: {
    marginBottom: 16,
    backgroundColor: '#ECE6F0',
    elevation: 2,
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantTotal: {
    fontWeight: 'bold',
    color: '#4F378A',
  },
  noContributions: {
    ...typography.bodyMedium,
    opacity: 0.6,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  contributionsList: {
    marginBottom: 8,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  contributionInfo: {
    flex: 1,
  },
  contributionAmount: {
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    marginVertical: 4,
  },
  addButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 16,
  },
});



