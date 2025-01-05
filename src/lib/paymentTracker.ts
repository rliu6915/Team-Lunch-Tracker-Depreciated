// utils/paymentTracker.ts
export type Payer = {
  id: string;
  payerName: string;
  order: number;
};

export const payersSchema = {
  currentIndex: 0,
  initialPayers: []
};

// Get current person paying for lunch
export function getCurrentPayer() {
  const index = payersSchema.currentIndex
  return payersSchema.initialPayers[index];
}

// Get the next person to pay
export function getNextPayer() {
  return payersSchema.initialPayers[(payersSchema.currentIndex + 1) % payersSchema.initialPayers.length];
}

// Move to the next payer
export function shiftToNextPayer() {
  payersSchema.currentIndex = (payersSchema.currentIndex + 1) % payersSchema.initialPayers.length;
}
