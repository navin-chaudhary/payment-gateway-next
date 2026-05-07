import { useState, useCallback } from "react"
import type { FormErrors, PaymentFormValues } from "@/types/payment"
import { validateCardDetails } from "@/utils/cardUtils"
import { formatCardNumber, formatExpiryDate, detectCardType } from "@/utils/cardUtils"

const initialValues: PaymentFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  amount: "",
  currency: "USD",
}

export function useFormValidation() {
  const [values, setValues] = useState<PaymentFormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentFormValues, boolean>>>({})

  const validateField = useCallback(
    (name: keyof PaymentFormValues, value: string) => {
      const allValues = { ...values, [name]: value }
      const allErrors = validateCardDetails(allValues)
      setErrors((prev) => ({
        ...prev,
        [name]: allErrors[name],
      }))
    },
    [values]
  )

  const handleChange = useCallback(
    (name: keyof PaymentFormValues, rawValue: string) => {
      let value = rawValue

      if (name === "cardNumber") {
        value = formatCardNumber(rawValue)
      } else if (name === "expiryDate") {
        value = formatExpiryDate(rawValue)
      } else if (name === "cvv") {
        const cardType = detectCardType(values.cardNumber)
        const maxLen = cardType === "amex" ? 4 : 3
        value = rawValue.replace(/\D/g, "").slice(0, maxLen)
      } else if (name === "amount") {
        value = rawValue.replace(/[^0-9.]/g, "")
      }

      setValues((prev) => ({ ...prev, [name]: value }))

      if (touched[name]) {
        const allValues = { ...values, [name]: value }
        const allErrors = validateCardDetails(allValues)
        setErrors((prev) => ({
          ...prev,
          [name]: allErrors[name],
        }))
      }
    },
    [values, touched]
  )

  const handleBlur = useCallback(
    (name: keyof PaymentFormValues) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      validateField(name, values[name])
    },
    [validateField, values]
  )

  const validateAll = useCallback((): boolean => {
    const allErrors = validateCardDetails(values)
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof PaymentFormValues, boolean>
    )
    setErrors(allErrors)
    setTouched(allTouched)
    return Object.keys(allErrors).length === 0
  }, [values])

  const isFormValid = useCallback((): boolean => {
    const allErrors = validateCardDetails(values)
    return Object.keys(allErrors).length === 0
  }, [values])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isFormValid,
    resetForm,
  }
}
