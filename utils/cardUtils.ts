import type { CardType } from "@/types/payment"

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  const limited = digits.slice(0, 16)
  const groups = limited.match(/.{1,4}/g) ?? []
  return groups.join(" ")
}

export function detectCardType(cardNumber: string): CardType {
  const digits = cardNumber.replace(/\s/g, "")
  if (/^4/.test(digits)) return "visa"
  if (/^5/.test(digits)) return "mastercard"
  if (/^3[47]/.test(digits)) return "amex"
  return "unknown"
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return digits
  return digits.slice(0, 2) + "/" + digits.slice(2, 4)
}

export function validateCardDetails(values: {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
  amount: string
}) {
  const errors: Record<string, string> = {}

  if (!values.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required"
  } else if (values.cardholderName.trim().length < 2) {
    errors.cardholderName = "Name must be at least 2 characters"
  }

  const cardDigits = values.cardNumber.replace(/\s/g, "")
  if (!cardDigits) {
    errors.cardNumber = "Card number is required"
  } else if (cardDigits.length < 15 || cardDigits.length > 16) {
    errors.cardNumber = "Enter a valid 15 or 16-digit card number"
  }

  if (!values.expiryDate) {
    errors.expiryDate = "Expiry date is required"
  } else {
    const [monthStr, yearStr] = values.expiryDate.split("/")
    const month = parseInt(monthStr ?? "", 10)
    const year = parseInt(yearStr ?? "", 10)
    const now = new Date()
    const currentYear = now.getFullYear() % 100
    const currentMonth = now.getMonth() + 1
    if (!month || !year || month < 1 || month > 12) {
      errors.expiryDate = "Enter a valid expiry date (MM/YY)"
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.expiryDate = "Card has expired"
    }
  }

  const cardType = detectCardType(values.cardNumber)
  const cvvLength = cardType === "amex" ? 4 : 3
  if (!values.cvv) {
    errors.cvv = "CVV is required"
  } else if (values.cvv.length !== cvvLength) {
    errors.cvv = `CVV must be ${cvvLength} digits for ${cardType === "amex" ? "Amex" : "this card"}`
  }

  if (!values.amount) {
    errors.amount = "Amount is required"
  } else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
    errors.amount = "Enter a valid amount greater than 0"
  }

  return errors
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "")
  if (digits.length < 4) return cardNumber
  const last4 = digits.slice(-4)
  const masked = "*".repeat(digits.length - 4)
  const full = masked + last4
  const groups = full.match(/.{1,4}/g) ?? []
  return groups.join(" ")
}

export function getCardLastFour(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "")
  return digits.slice(-4)
}
