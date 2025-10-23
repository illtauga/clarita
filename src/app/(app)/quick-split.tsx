import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, Share, Animated } from 'react-native';
import { Text, TextInput, Button, IconButton, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../theme/typography';
import { router } from 'expo-router';
import { buttonStyles } from '../../theme/buttons';
import { calculateBalances } from '../../utils/balanceCalculator';

type Participant = { id: string; name: string; paid: string; emoji?: string };

const EMOJIS = ['😎','🐱','🤓','🤠','😜','🐵','🐻','🐸','🧙‍♂️'];

export default function QuickSplitScreen() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [paidInput, setPaidInput] = useState('');
  const [emojiInput, setEmojiInput] = useState<string | undefined>(undefined);

  // Step 2 state
  const [mode, setMode] = useState<'aportado' | 'manual'>('aportado');
  const [manualTotal, setManualTotal] = useState('');

  // Animaciones
  const progressAnim = useState(new Animated.Value(0))[0];
  const contentOpacity = useState(new Animated.Value(1))[0];

  const total = useMemo(() => {
    return participants.reduce((acc, p) => acc + (parseFloat(p.paid) || 0), 0);
  }, [participants]);

  const perHead = useMemo(() => {
    const base = mode === 'manual' ? (parseFloat(manualTotal) || 0) : total;
    return participants.length > 0 ? base / participants.length : 0;
  }, [participants, total, manualTotal, mode]);

  // Animaciones cuando cambia el step
  useEffect(() => {
    // Animación de la barra de progreso
    const progressValue = step === 0 ? 33 : step === 1 ? 66 : 100;
    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Animación de fade del contenido
    Animated.sequence([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const effectiveTotal = mode === 'manual' ? (parseFloat(manualTotal) || 0) : total;

  const balances = useMemo(() => {
    const totalToUse = effectiveTotal;
    const perPersonAmount = totalToUse / participants.length;
    
    return participants.map(p => ({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      paid: parseFloat(p.paid) || 0,
      balance: (parseFloat(p.paid) || 0) - perPersonAmount,
    }));
  }, [participants, effectiveTotal]);

  const addPerson = () => {
    setShowAdd(true);
  };

  const updatePaid = (id: string, paid: string) => {
    setParticipants(prev => prev.map(p => (p.id === id ? { ...p, paid } : p)));
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const submitAdd = () => {
    const nextId = (participants.length + 1).toString();
    const cleaned = nameInput.trim() || `Persona ${nextId}`;
    setParticipants(prev => [...prev, { id: nextId, name: cleaned, paid: paidInput, emoji: emojiInput }]);
    setNameInput('');
    setPaidInput('');
    setEmojiInput(undefined);
    setShowAdd(false);
  };

  const canContinue = participants.length >= 2;

  const handleBack = () => {
    if (step > 0) {
      setStep((step - 1) as 0 | 1 | 2);
    } else {
      router.back();
    }
  };

  const handleShare = async () => {
    try {
      const totalSpent = effectiveTotal;
      const perHead = totalSpent / participants.length;
      
      let shareText = `💰 Resumen de gastos compartidos:\n\n`;
      shareText += `Total gastado: $${totalSpent.toFixed(2)}\n`;
      shareText += `Participantes: ${participants.length}\n`;
      shareText += `Monto por persona: $${perHead.toFixed(2)}\n\n`;
      
      // Agregar detalles de pagos
      const participantsWithTotals = participants.map(p => ({
        id: p.id,
        name: p.name,
        paid: parseFloat(p.paid || '0')
      }));
      
      const balances = calculateBalances(participantsWithTotals, totalSpent);
      const payments = balances.filter((b: any) => b.balance < 0);
      
      if (payments.length > 0) {
        shareText += `📋 Pagos pendientes:\n`;
        payments.forEach((payment: any) => {
          const recipients = balances.filter((r: any) => r.balance > 0);
          if (recipients.length === 1) {
            const recipient = recipients[0];
            shareText += `• ${payment.name} debe pagar $${Math.abs(payment.balance).toFixed(2)} a ${recipient.name}\n`;
          } else {
            const totalPositive = recipients.reduce((sum: number, r: any) => sum + r.balance, 0);
            recipients.forEach((recipient: any) => {
              const amount = (recipient.balance / totalPositive) * Math.abs(payment.balance);
              shareText += `• ${payment.name} debe pagar $${amount.toFixed(2)} a ${recipient.name}\n`;
            });
          }
        });
      } else {
        shareText += `✅ Todos están al día!\n`;
      }
      
      shareText += `\nCalculado con Clarita 💜`;
      
      await Share.share({
        message: shareText,
        title: 'Resumen de gastos compartidos',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {step === 2 ? (
          <>
            <IconButton icon="arrow-left" onPress={() => {}} style={{ opacity: 0 }} />
            <Text style={styles.headerTitle}>Resultados</Text>
            <View style={{ width: 48 }} />
          </>
        ) : (
          <>
            <IconButton icon="arrow-left" onPress={handleBack} />
            <Text style={styles.headerTitle}>¡Hagamos las cuentas!</Text>
        <View style={{ width: 48 }} />
          </>
        )}
      </View>

      {/* Progress bar animada */}
      {step !== 2 && (
      <View style={styles.progressBarWrapper}>
          <Animated.View style={[styles.progressBarFill, { width: progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }) }]} />
        </View>
      )}

      {step === 2 ? (
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <ScrollView contentContainerStyle={styles.scrollContentResults}>
            <Text style={styles.resultsTitle}>
              ¡Todo listo!{'\n'}Solo falta pasar la gorra 🧢
            </Text>
            <Text style={styles.resultsSubtitle}>Clarita calculó todo para que nadie discuta.</Text>
          
          <View style={styles.paymentInstructions}>
            {/* Primero mostrar los que deben pagar */}
            {balances.filter(b => b.balance < 0).map((b, index, array) => {
              const isLastDebt = index === array.length - 1;
              const hasUpToDate = balances.filter(r => r.balance >= 0).length > 0;
              const shouldReduceMargin = isLastDebt && hasUpToDate;
              
              // Esta persona debe pagar
              const amountToPay = Math.abs(b.balance);
              const recipients = balances.filter(r => r.balance > 0);
              
              if (recipients.length === 1) {
                // Si solo hay un receptor, mostrar directamente
                const recipient = recipients[0];
                return (
                  <View key={b.id}>
                    <View style={[styles.paymentSection, shouldReduceMargin && styles.lastPaymentSection]}>
                      <Text style={styles.payerName}>
                        {(b.emoji || '🙂')} {b.name} <Text style={styles.payerAction}>debe pagar a</Text>
                      </Text>
                      <View style={[styles.paymentCard, shouldReduceMargin && styles.lastPaymentCard]}>
                        <View style={styles.paymentCardContent}>
                          <View style={styles.leftGroup}>
                            <Text style={styles.recipientEmoji}>{(recipient.emoji || '🙂')}</Text>
                            <Text style={styles.recipientName}>{recipient.name}</Text>
                          </View>
                          <View style={styles.centerGroup}>
                            <Text style={styles.paymentArrow}>→</Text>
                          </View>
                          <View style={styles.rightGroup}>
                            <Text style={styles.paymentEmoji}>💸</Text>
                            <Text style={styles.paymentAmount}>$ {amountToPay.toFixed(0)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* Línea divisoria entre contenedores de pago */}
                    {index < array.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              } else {
                // Si hay múltiples receptores, mostrar cada uno con su parte proporcional
                return (
                  <View key={b.id}>
                    <View style={[styles.paymentSection, shouldReduceMargin && styles.lastPaymentSection]}>
                      <Text style={styles.payerName}>
                        {(b.emoji || '🙂')} {b.name} <Text style={styles.payerAction}>debe pagar a</Text>
                      </Text>
                      {recipients.map((recipient, recipientIndex) => {
                        const recipientAmount = (recipient.balance / balances.reduce((sum, r) => sum + Math.max(0, r.balance), 0)) * amountToPay;
                        const isLastRecipient = recipientIndex === recipients.length - 1;
                        return (
                          <View key={recipient.id} style={[styles.paymentCard, shouldReduceMargin && isLastRecipient && styles.lastPaymentCard]}>
                            <View style={styles.paymentCardContent}>
                              <View style={styles.leftGroup}>
                                <Text style={styles.recipientEmoji}>{(recipient.emoji || '🙂')}</Text>
                                <Text style={styles.recipientName}>{recipient.name}</Text>
                              </View>
                              <View style={styles.centerGroup}>
                                <Text style={styles.paymentArrow}>→</Text>
                              </View>
                              <View style={styles.rightGroup}>
                                <Text style={styles.paymentEmoji}>💸</Text>
                                <Text style={styles.paymentAmount}>$ {recipientAmount.toFixed(0)}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              }
            })}

            {/* Línea divisoria si hay deudas y personas al día (solo si hay más de 2 participantes) */}
            {participants.length > 2 && balances.filter(b => b.balance < 0).length > 0 && balances.filter(b => b.balance >= 0).length > 0 && (
              <View style={styles.divider} />
            )}

            {/* Luego mostrar los que están al día (solo si hay más de 2 participantes) */}
            {participants.length > 2 && balances.filter(b => b.balance >= 0).map((b, index) => (
              <View key={b.id} style={[styles.upToDateCard, index === 0 && styles.firstUpToDateCard]}>
                <Text style={styles.upToDateText}>
                  {(b.emoji || '🙂')} {b.name} <Text style={styles.payerAction}>está al día</Text> 🎉
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard1}>
              <Text style={styles.summaryTitle}>Monto por persona</Text>
              <Text style={styles.summaryValue1}>${(effectiveTotal / participants.length).toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryCard2}>
              <Text style={styles.summaryTitle}>Total de participantes</Text>
              <Text style={styles.summaryValue2}>{participants.length} participantes</Text>
      </View>

            <View style={styles.summaryCard3}>
              <Text style={styles.summaryTitle3}>Total gastado</Text>
              <Text style={styles.summaryValue3}>${effectiveTotal.toFixed(2)}</Text>
            </View>
          </View>
          </ScrollView>
        </Animated.View>
      ) : (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      {step === 0 && (
          <Animated.View style={[styles.content, styles.withFooterPadding, { opacity: contentOpacity }]}>
          <Text style={styles.stepTitle}>¿Quién puso cuánto?</Text>
          <Text style={styles.stepSubtitle}>Sumá a las personas y anotá lo que aportaron.</Text>

          {participants.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.ghostEmoji}>👻</Text>
                  <Text style={styles.emptyTitle}>¡Acá no hay nadie todavía!</Text>
                  <Text style={styles.emptyDesc}>Agregá al primer participante para que arranque la magia.</Text>
                <Button icon="plus" mode="contained-tonal" onPress={addPerson} style={styles.addBtn}>Agregar participante</Button>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Participantes ({participants.length})</Text>
              <FlatList
                data={participants}
                keyExtractor={p => p.id}
                ItemSeparatorComponent={Divider}
                renderItem={({ item }) => (
                  <View style={styles.participantRow}>
                    <Text style={styles.emoji}>{item.emoji || '🙂'}</Text>
                      <Text style={styles.participantName}>
                        <Text style={styles.participantNameBold}>{item.name}</Text>
                        <Text style={styles.participantNameRegular}> aportó</Text>
                      </Text>
                    <TextInput
                      label="$"
                      value={item.paid}
                      onChangeText={(v) => updatePaid(item.id, v)}
                      keyboardType="decimal-pad"
                      mode="outlined"
                      style={styles.amount}
                        returnKeyType="done"
                        onSubmitEditing={() => {}}
                    />
                    <IconButton icon="delete-outline" onPress={() => removeParticipant(item.id)} />
                  </View>
                )}
              />
                <Button icon="plus" mode="contained-tonal" onPress={addPerson} style={styles.addBtnWithParticipants}>Agregar participante</Button>
            </>
          )}

          </Animated.View>
      )}

      {step === 1 && (
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.stepTitle}>¿Querés repartir un monto específico?</Text>
          <Text style={styles.stepSubtitle}>Podés dejar que Clarita reparta lo aportado o ingresar un total manualmente.</Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggle, mode === 'aportado' && styles.toggleSelected]}
                onPress={() => setMode('aportado')}
              >
                <Text style={[styles.toggleText, mode === 'aportado' && styles.toggleTextSelected]}>
                  Usar lo aportado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggle, mode === 'manual' && styles.toggleSelected]}
                onPress={() => setMode('manual')}
              >
                <Text style={[styles.toggleText, mode === 'manual' && styles.toggleTextSelected]}>
                  Ingresar un total
                </Text>
              </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            {mode === 'aportado' ? 'Vamos a sumar lo que cada uno puso para repartir los gastos en base a eso.' : 'Este total se divide entre todos por igual.'}
          </Text>

          <TextInput
            label="Monto total"
            value={mode === 'aportado' ? total.toFixed(2) : manualTotal}
            onChangeText={setManualTotal}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            disabled={mode === 'aportado'}
              returnKeyType="done"
              onSubmitEditing={() => {}}
            />
        </ScrollView>
          </Animated.View>
      )}
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      )}

      {/* Fixed Footer CTA */}
      {step === 0 && (
        <View style={styles.fixedFooter}>
          <Button
            mode="contained"
            disabled={!canContinue}
            onPress={() => setStep(1)}
            style={[
              buttonStyles.button, 
              canContinue ? buttonStyles.primary : styles.disabledButton, 
              canContinue ? buttonStyles.contained : buttonStyles.outlined
            ]}
            contentStyle={buttonStyles.content}
            labelStyle={canContinue ? buttonStyles.primaryText : styles.disabledButtonText}
          >
            Continuar
          </Button>
        </View>
      )}
      {step === 1 && (
        <View style={styles.fixedFooter}>
          <Button
            mode="contained"
            disabled={effectiveTotal <= 0 || participants.length === 0}
            onPress={() => setStep(2)}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
          >
            Calcular gastos
          </Button>
        </View>
      )}
      {step === 2 && (
        <View style={styles.fixedFooter}>
          <Button
            mode="contained"
            icon="share-variant"
            onPress={handleShare}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
          >
            Compartir resultados
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.secondaryText}
          >
            Finalizar
          </Button>
        </View>
      )}

      <Modal
        visible={showAdd}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAdd(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <IconButton icon="arrow-left" onPress={() => setShowAdd(false)} />
          <Text style={styles.modalTitle}>Agregar participante</Text>
          <View style={{ width: 48 }} />
        </View>
        <ScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetBigTitle}>¿Quién se suma?</Text>
          <Text style={styles.sheetSubtitle}>Completá los datos del participante y ponéle una cara 😁</Text>
          <Text style={styles.sectionHeader}>Datos del participante</Text>
          <TextInput
            label="Nombre del participante"
            value={nameInput}
            onChangeText={setNameInput}
            mode="outlined"
            style={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => {}}
          />
          <TextInput
            label="Monto aportado"
            value={paidInput}
            onChangeText={setPaidInput}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => {}}
          />
            <Text style={styles.emojiSectionTitle}>Elegí un emoji para identificarlo (Opcional)</Text>
          <View style={styles.emojiGrid}>
            <TouchableOpacity onPress={() => setEmojiInput(undefined)} style={[styles.emojiOption, !emojiInput && styles.emojiOptionSelected]}>
              <Text style={styles.emojiOptionText}>🚫</Text>
            </TouchableOpacity>
            {EMOJIS.map(e => (
              <TouchableOpacity key={e} onPress={() => setEmojiInput(e)} style={[styles.emojiOption, emojiInput === e && styles.emojiOptionSelected]}>
                <Text style={styles.emojiOptionText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.sheetFooter}>
          <Button
            mode="contained"
            onPress={submitAdd}
            style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
            contentStyle={buttonStyles.content}
            labelStyle={buttonStyles.primaryText}
          >
                  Agregar participante
          </Button>
        </View>
        </SafeAreaView>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: '#E9E4F2',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#4F378A',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 140, // Para el footer en el paso 1
  },
  scrollContentResults: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 220, // Más padding para los resultados
  },
  withFooterPadding: { paddingBottom: 140 },
  stepTitle: {
    ...typography.headlineMedium,
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
    marginBottom: 48,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  ghostEmoji: { 
    fontSize: 64, 
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    marginTop: 24,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emoji: { width: 28, textAlign: 'center', marginRight: 12 },
  participantName: { flex: 1, ...typography.bodyLarge },
  participantNameBold: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-SemiBold' 
  },
  participantNameRegular: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-Regular' 
  },
  amount: {
    width: 140,
  },
  addBtn: { 
    marginTop: 12,
    alignSelf: 'center',
    minWidth: 200,
  },
  addBtnWithParticipants: { 
    marginTop: 12, 
    alignSelf: 'flex-start',
    minWidth: 200,
  },
  bottomCta: { marginTop: 24 },
  bottomCtaRow: { marginTop: 24, flexDirection: 'row' },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSelected: {
    backgroundColor: '#4F378A',
    shadowColor: '#4F378A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Medium',
    color: '#4F378A',
  },
  toggleTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  helperText: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-Regular', 
    opacity: 0.7, 
    marginBottom: 12 
  },
  balances: {
    marginTop: 8,
    marginBottom: 16,
  },
  balanceLine: {
    ...typography.bodyLarge,
    marginBottom: 4,
  },
  // Nuevos estilos para resultados
  resultsTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    opacity: 0.7,
    marginBottom: 32,
  },
  paymentInstructions: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 32,
    marginBottom: 32,
    marginHorizontal: 0,
    width: '100%',
  },
  paymentSection: {
    marginBottom: 20,
  },
  lastPaymentSection: {
    marginBottom: 0,
  },
  payerName: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  payerAction: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  paymentCard: {
    backgroundColor: '#E8E0FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  lastPaymentCard: {
    marginBottom: 0,
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  recipientEmoji: {
    fontSize: 20,
  },
  recipientName: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  paymentArrow: {
    fontSize: 16,
  },
  paymentEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  paymentAmount: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-SemiBold',
  },
  upToDateCard: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  firstUpToDateCard: {
    marginTop: 0,
  },
  upToDateText: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-SemiBold',
  },
  summaryContainer: {
    marginTop: 8,
    marginHorizontal: -16, // Compensar el padding del scrollContent
  },
  summaryCard1: {
    backgroundColor: '#2D1B69', // Morado oscuro
    padding: 20,
    borderRadius: 0, // Sin bordes redondeados para que estén pegados
  },
  summaryCard2: {
    backgroundColor: '#4F378A', // Morado medio
    padding: 20,
    borderRadius: 0, // Sin bordes redondeados para que estén pegados
  },
  summaryCard3: {
    backgroundColor: '#E8E0FF', // Morado claro
    padding: 20,
    borderRadius: 0, // Sin bordes redondeados para que estén pegados
  },
  summaryTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryTitle3: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D1B69',
    marginBottom: 4,
  },
  summaryValue1: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  summaryValue2: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  summaryValue3: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
    color: '#2D1B69',
  },
  button: {
    marginTop: 8,
  },
  dialogSubtitle: { marginBottom: 8, ...typography.titleMedium },
  emojiGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: '#fff',
    // sin línea separadora para respetar el diseño
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#BDBDBD',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Medium',
  },
  emojiChip: { marginRight: 8, marginBottom: 8 },
  emojiChipSelected: { borderColor: '#4F378A', borderWidth: 1 },
  // Bottom sheet styles
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sheetFooter: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sheetHeaderPad: { height: 4 },
  sheetBigTitle: { ...typography.headlineMedium, marginBottom: 6, marginTop: 20 },
  sheetSubtitle: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-Regular', 
    opacity: 0.7, 
    marginBottom: 16 
  },
  sectionHeader: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-SemiBold', 
    marginBottom: 12, 
    marginTop: 24 
  },
  emojiSectionTitle: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'Poppins-SemiBold', 
    marginTop: 24, 
    marginBottom: 12 
  },
  emojiOption: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  emojiOptionSelected: {
    borderColor: '#4F378A',
    backgroundColor: '#E8E0FF',
  },
  emojiOptionText: { fontSize: 24 },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});


