"use client"
import { useCallback, useRef } from "react"
import { usePaymentStore } from "../store/paymentStore"
import { callPaymentApi } from "../utils/apiHandler"
import { detectCardType, getCardLastFour } from "../utils/cardUtils"
import type { PaymentFormValues, Transaction } from "../types/payment"
import toast from "react-hot-toast"

const MAX_RETRIES = 3
const TIMEOUT_MS = 6000

export function usePayment() {
  const {
    paymentStatus,
    retryAttempts,
    currentTransactionId,
    failureReason,
    setPaymentStatus,
    setCurrentTransactionId,
    addTransaction,
    updateTransaction,
    incrementRetry,
    resetPayment,
    setFailureReason,
  } = usePaymentStore()

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const processPayment = useCallback(
    async (formValues: PaymentFormValues, isRetry = false) => {
      if (paymentStatus === "processing") return

      let txId = currentTransactionId
      if (!isRetry || !txId) {
        txId = crypto.randomUUID()
        setCurrentTransactionId(txId)
      }

      const attemptNumber = isRetry ? retryAttempts + 1 : 1

      if (isRetry) {
        incrementRetry()
      }

      setPaymentStatus("processing")
      setFailureReason(null)

      const cardType = detectCardType(formValues.cardNumber)
      const cardLastFour = getCardLastFour(formValues.cardNumber)

      const newTx: Transaction = {
        transactionId: txId,
        amount: formValues.amount,
        currency: formValues.currency,
        status: "processing",
        timestamp: new Date().toISOString(),
        cardholderName: formValues.cardholderName,
        cardLastFour,
        cardType,
        attempts: attemptNumber,
      }

      if (!isRetry) {
        addTransaction(newTx)
      } else {
        updateTransaction(txId, { status: "processing", attempts: attemptNumber })
      }

      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current

      // Frontend 6 s timeout — aborts the fetch, which the server sees as a closed connection
      timeoutRef.current = setTimeout(() => {
        abortControllerRef.current?.abort()
      }, TIMEOUT_MS)

      try {
        const result = await callPaymentApi(
          { ...formValues, transactionId: txId },
          signal
        )

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        if (result.status === "success") {
          setPaymentStatus("success")
          updateTransaction(txId, { status: "success" })
          toast.success("Payment successful!")
        } else {
          setPaymentStatus("failed")
          setFailureReason(result.message)
          updateTransaction(txId, { status: "failed", failureReason: result.message })
          toast.error(result.message)
        }
      } catch (err) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        const isAbort = err instanceof DOMException && err.name === "AbortError"

        if (isAbort) {
          setPaymentStatus("timeout")
          updateTransaction(txId, { status: "timeout" })
          toast.error("Request timed out. Please try again.")
        } else {
          setPaymentStatus("failed")
          const message = "A network error occurred. Please try again."
          setFailureReason(message)
          updateTransaction(txId, { status: "failed", failureReason: message })
          toast.error(message)
        }
      }
    },
    [
      paymentStatus,
      currentTransactionId,
      retryAttempts,
      setPaymentStatus,
      setCurrentTransactionId,
      addTransaction,
      updateTransaction,
      incrementRetry,
      setFailureReason,
    ]
  )

  const retryPayment = useCallback(
    (formValues: PaymentFormValues) => {
      if (retryAttempts >= MAX_RETRIES) return
      processPayment(formValues, true)
    },
    [retryAttempts, processPayment]
  )

  const canRetry = retryAttempts < MAX_RETRIES
  const currentAttempt = retryAttempts + 1

  return {
    paymentStatus,
    retryAttempts,
    canRetry,
    currentAttempt,
    failureReason,
    processPayment,
    retryPayment,
    resetPayment,
    MAX_RETRIES,
  }
}