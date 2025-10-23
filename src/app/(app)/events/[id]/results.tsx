import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Text, IconButton, Button, Card, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../../../theme/typography';
import { buttonStyles } from '../../../../theme/buttons';
import { supabase } from '../../../../lib/supabase';
import { Event } from '../../../../types/supabase';
import { 
  calculateBalances, 
  calculatePaymentSuggestions, 
  generateShareableText,
  ParticipantBalance,
  PaymentSuggestion
} from '../../../../utils/balanceCalculator';

interface ParticipantData {
  id: string;
  name: string;
  paid: number;
}

export default function ResultsScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [balances, setBalances] = useState<ParticipantBalance[]>([]);
  const [suggestions, setSuggestions] = useState<PaymentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDataAndCalculate();
  }, [id]);

  const fetchDataAndCalculate = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch participants with contributions
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('id, name')
        .eq('event_id', id);

      if (participantsError) throw participantsError;

      // Calculate total paid by each participant
      const participantsWithTotals = await Promise.all(
        (participantsData || []).map(async (participant) => {
          const { data: contributions, error: contributionsError } = await supabase
            .from('contributions')
            .select('amount')
            .eq('participant_id', participant.id);

          if (contributionsError) throw contributionsError;

          const paid = (contributions || []).reduce((sum, c) => sum + Number(c.amount), 0);

          return {
            id: participant.id,
            name: participant.name,
            paid,
          };
        })
      );

      const totalPaid = participantsWithTotals.reduce((sum, p) => sum + p.paid, 0);

      setParticipants(participantsWithTotals);
      setTotal(totalPaid);

      // Calculate balances and suggestions
      const calculatedBalances = calculateBalances(participantsWithTotals, totalPaid);
      const calculatedSuggestions = calculatePaymentSuggestions(calculatedBalances);

      setBalances(calculatedBalances);
      setSuggestions(calculatedSuggestions);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'No se pudieron cargar los resultados');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleShare = async () => {
    if (!event) return;

    const text = generateShareableText(event.title, balances, suggestions, total);

    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="titleLarge" style={styles.headerTitle}>Resultados</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Calculando balances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const perPerson = participants.length > 0 ? total / participants.length : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.headerTitle}>Resultados</Text>
        <IconButton icon="share-variant" size={24} onPress={handleShare} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              {event?.title}
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Gastado</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Por Persona</Text>
                <Text style={styles.summaryValue}>${perPerson.toFixed(2)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Balances Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Balances
          </Text>
          <Card style={styles.card}>
            <Card.Content>
              {balances.map((balance, index) => (
                <View key={balance.id}>
                  {index > 0 && <Divider style={styles.divider} />}
                  <View style={styles.balanceRow}>
                    <View style={styles.balanceInfo}>
                      <Text variant="bodyLarge" style={styles.balanceName}>
                        {balance.name}
                      </Text>
                      <Text variant="bodyMedium" style={styles.balancePaid}>
                        Aportó: ${balance.paid.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.balanceResult}>
                      {Math.abs(balance.balance) < 0.01 ? (
                        <Chip icon="check-circle" textStyle={styles.chipText} style={styles.chipBalanced}>
                          Al día
                        </Chip>
                      ) : balance.balance > 0 ? (
                        <Chip icon="arrow-down" textStyle={styles.chipText} style={styles.chipCredit}>
                          +${balance.balance.toFixed(2)}
                        </Chip>
                      ) : (
                        <Chip icon="arrow-up" textStyle={styles.chipText} style={styles.chipDebt}>
                          -${Math.abs(balance.balance).toFixed(2)}
                        </Chip>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Payment Suggestions Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Pagos Sugeridos
          </Text>
          {suggestions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  ✅ ¡Todos están al día!
                </Text>
                <Text style={styles.emptySubtext}>
                  No hay pagos pendientes
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                {suggestions.map((suggestion, index) => (
                  <View key={index}>
                    {index > 0 && <Divider style={styles.divider} />}
                    <View style={styles.suggestionRow}>
                      <View style={styles.suggestionInfo}>
                        <Text variant="bodyLarge" style={styles.suggestionFrom}>
                          {suggestion.fromName}
                        </Text>
                        <View style={styles.suggestionArrow}>
                          <Text style={styles.arrowText}>→</Text>
                        </View>
                        <Text variant="bodyLarge" style={styles.suggestionTo}>
                          {suggestion.toName}
                        </Text>
                      </View>
                      <Text style={styles.suggestionAmount}>
                        ${suggestion.amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={[buttonStyles.container, styles.actionsContainer]}>
          <Button
            mode="contained"
            icon="share-variant"
            onPress={handleShare}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
          >
            Compartir Resultados
          </Button>

          <Button
            mode="outlined"
            icon="arrow-left"
            onPress={() => router.back()}
            style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.secondaryText}
          >
            Volver a Aportes
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
  summaryCard: {
    marginBottom: 24,
    backgroundColor: '#E9D5FF',
    elevation: 3,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.bodyMedium,
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    ...typography.headlineSmall,
    fontWeight: 'bold',
    color: '#4F378A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.titleLarge,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ECE6F0',
    elevation: 2,
  },
  emptyCard: {
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 18,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    textAlign: 'center',
    opacity: 0.7,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  balancePaid: {
    opacity: 0.7,
  },
  balanceResult: {
    marginLeft: 12,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipBalanced: {
    backgroundColor: '#D1FAE5',
  },
  chipCredit: {
    backgroundColor: '#DCFCE7',
  },
  chipDebt: {
    backgroundColor: '#FEE2E2',
  },
  divider: {
    marginVertical: 4,
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  suggestionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionFrom: {
    fontWeight: '600',
  },
  suggestionArrow: {
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 20,
    color: '#4F378A',
    fontWeight: 'bold',
  },
  suggestionTo: {
    fontWeight: '600',
  },
  suggestionAmount: {
    ...typography.titleMedium,
    fontWeight: 'bold',
    color: '#4F378A',
    marginLeft: 12,
  },
  actionsContainer: {
    marginTop: 8,
  },
});


