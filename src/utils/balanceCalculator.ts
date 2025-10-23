// Algoritmo para calcular balances y sugerencias de pago

export interface ParticipantBalance {
  id: string;
  name: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

export interface PaymentSuggestion {
  from: string; // ID del que paga
  fromName: string;
  to: string; // ID del que recibe
  toName: string;
  amount: number;
}

/**
 * Calcula el balance de cada participante
 * @param participants Array de participantes con sus aportes
 * @param total Total gastado en el evento
 * @returns Array de ParticipantBalance
 */
export function calculateBalances(
  participants: Array<{ id: string; name: string; paid: number }>,
  total: number
): ParticipantBalance[] {
  if (participants.length === 0) return [];

  const perPerson = total / participants.length;

  return participants.map(p => ({
    ...p,
    shouldPay: perPerson,
    balance: p.paid - perPerson,
  }));
}

/**
 * Calcula las sugerencias de pago óptimas usando un algoritmo greedy
 * @param balances Array de ParticipantBalance
 * @returns Array de PaymentSuggestion
 */
export function calculatePaymentSuggestions(balances: ParticipantBalance[]): PaymentSuggestion[] {
  const suggestions: PaymentSuggestion[] = [];
  
  // Separar deudores y acreedores
  const debtors = balances
    .filter(b => b.balance < -0.01) // Los que deben pagar (balance negativo)
    .map(b => ({ ...b, remaining: -b.balance }))
    .sort((a, b) => b.remaining - a.remaining); // Mayor deuda primero

  const creditors = balances
    .filter(b => b.balance > 0.01) // Los que deben recibir (balance positivo)
    .map(b => ({ ...b, remaining: b.balance }))
    .sort((a, b) => b.remaining - a.remaining); // Mayor crédito primero

  let i = 0; // Índice de deudores
  let j = 0; // Índice de acreedores

  // Algoritmo greedy: emparejar el mayor deudor con el mayor acreedor
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.remaining, creditor.remaining);

    if (amount > 0.01) { // Solo agregar si el monto es significativo
      suggestions.push({
        from: debtor.id,
        fromName: debtor.name,
        to: creditor.id,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100, // Redondear a 2 decimales
      });
    }

    debtor.remaining -= amount;
    creditor.remaining -= amount;

    // Mover al siguiente deudor/acreedor si ya quedó en 0
    if (debtor.remaining < 0.01) i++;
    if (creditor.remaining < 0.01) j++;
  }

  return suggestions;
}

/**
 * Genera un resumen de texto para compartir
 * @param eventTitle Título del evento
 * @param balances Balances de los participantes
 * @param suggestions Sugerencias de pago
 * @param total Total gastado
 * @returns String con el resumen formateado
 */
export function generateShareableText(
  eventTitle: string,
  balances: ParticipantBalance[],
  suggestions: PaymentSuggestion[],
  total: number
): string {
  let text = `🎉 *${eventTitle}*\n\n`;
  text += `💰 *Total gastado:* $${total.toFixed(2)}\n`;
  text += `👥 *Participantes:* ${balances.length}\n`;
  text += `📊 *Por persona:* $${(total / balances.length).toFixed(2)}\n\n`;

  text += `*--- Aportes ---*\n`;
  balances.forEach(b => {
    text += `${b.name}: $${b.paid.toFixed(2)}\n`;
  });

  text += `\n*--- Balances ---*\n`;
  balances.forEach(b => {
    if (balances.length > 2 && Math.abs(b.balance) < 0.01) {
      text += `${b.name}: ✅ Está al día\n`;
    } else if (b.balance > 0) {
      text += `${b.name}: 💚 Debe recibir $${b.balance.toFixed(2)}\n`;
    } else if (b.balance < 0) {
      text += `${b.name}: 💸 Debe pagar $${Math.abs(b.balance).toFixed(2)}\n`;
    }
  });

  if (suggestions.length > 0) {
    text += `\n*--- Pagos Sugeridos ---*\n`;
    suggestions.forEach((s, i) => {
      text += `${i + 1}. ${s.fromName} → ${s.toName}: $${s.amount.toFixed(2)}\n`;
    });
  } else {
    text += `\n✅ *¡Todos están al día!*\n`;
  }

  text += `\n_Calculado con Clarita 🧮_`;

  return text;
}

