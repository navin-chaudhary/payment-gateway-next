import { create } from "zustand"
import type { PaymentStatus, Transaction } from "@/types/payment"

const STORAGE_KEY = "payment_gateway_transactions"

function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {}
}
interface PaymentStore {
  paymentStatus: PaymentStatus
  transactionHistory: Transaction[]
  retryAttempts: number
  currentTransactionId: string | null
  selectedTransactionId: string | null
  failureReason: string | null

  setPaymentStatus: (status: PaymentStatus) => void
  setCurrentTransactionId: (id: string) => void
  addTransaction: (tx: Transaction) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void
  incrementRetry: () => void
  resetPayment: () => void
  setSelectedTransactionId: (id: string | null) => void
  setFailureReason: (reason: string | null) => void
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  paymentStatus: "idle",
  transactionHistory: loadTransactions(),
  retryAttempts: 0,
  currentTransactionId: null,
  selectedTransactionId: null,
  failureReason: null,

  setPaymentStatus: (status) => set({ paymentStatus: status }),

  setCurrentTransactionId: (id) => set({ currentTransactionId: id }),

  addTransaction: (tx) => {
    const updated = [tx, ...get().transactionHistory]
    saveTransactions(updated)
    set({ transactionHistory: updated })
  },

  updateTransaction: (transactionId, updates) => {
    const updated = get().transactionHistory.map((tx) =>
      tx.transactionId === transactionId ? { ...tx, ...updates } : tx
    )
    saveTransactions(updated)
    set({ transactionHistory: updated })
  },

  incrementRetry: () =>
    set((state) => ({ retryAttempts: state.retryAttempts + 1 })),

  resetPayment: () =>
    set({
      paymentStatus: "idle",
      retryAttempts: 0,
      currentTransactionId: null,
      failureReason: null,
    }),

  setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),

  setFailureReason: (reason) => set({ failureReason: reason }),
}))
