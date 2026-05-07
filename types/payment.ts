export type PaymentStatus = "idle" | "processing" | "success" | "failed" | "timeout"

export type CardType = "visa" | "mastercard" | "amex" | "unknown"

export interface PaymentPayload {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
  amount: string
  currency: "INR" | "USD"
  transactionId: string
}

export interface Transaction {
  transactionId: string
  amount: string
  currency: "INR" | "USD"
  status: PaymentStatus
  timestamp: string
  cardholderName: string
  cardLastFour: string
  cardType: CardType
  failureReason?: string
  attempts: number
}

export interface PaymentFormValues {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
  amount: string
  currency: "INR" | "USD"
}

export interface FormErrors {
  cardholderName?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  amount?: string
}

export interface MockApiResponse {
  success: boolean
  transactionId: string
  status: "success" | "failed" | "timeout"
  message: string
  timestamp: string
}
