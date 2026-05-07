"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CardPreview } from "@/components/CardPreview"
import { CardInput } from "@/components/CardInput"
import { StatusScreen } from "@/components/StatusScreen"
import { useFormValidation } from "@/hooks/useFormValidation"
import { usePayment } from "@/hooks/usePayment"
import { detectCardType } from "@/utils/cardUtils"

export function PaymentForm() {
  const [focusedField, setFocusedField] = useState<string | undefined>()

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    isFormValid,
    resetForm,
  } = useFormValidation()

  const {
    paymentStatus,
    retryAttempts,
    canRetry,
    failureReason,
    processPayment,
    retryPayment,
    resetPayment,
    MAX_RETRIES,
  } = usePayment()

  const cardType = detectCardType(values.cardNumber)
  const isProcessing = paymentStatus === "processing"
  const showStatus = paymentStatus !== "idle"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return
    processPayment(values)
  }

  const handleRetry = () => {
    retryPayment(values)
  }

  const handleReset = () => {
    resetPayment()
    resetForm()
  }

  const cvvMaxLength = cardType === "amex" ? 4 : 3

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Card Preview */}
      <CardPreview
        cardNumber={values.cardNumber}
        cardholderName={values.cardholderName}
        expiryDate={values.expiryDate}
        cardType={cardType}
        focusedField={focusedField}
      />

      {/* Status Screen or Form */}
      {showStatus ? (
        <StatusScreen
          status={paymentStatus}
          failureReason={failureReason}
          retryAttempts={retryAttempts}
          maxRetries={MAX_RETRIES}
          canRetry={canRetry}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          noValidate
          className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
        >
          {/* Cardholder Name */}
          <CardInput
            id="cardholderName"
            label="Cardholder Name"
            value={values.cardholderName}
            onChange={(v) => handleChange("cardholderName", v)}
            onBlur={() => handleBlur("cardholderName")}
            onFocus={() => setFocusedField("cardholderName")}
            error={errors.cardholderName}
            placeholder="John Doe"
            autoComplete="cc-name"
          />

          {/* Card Number */}
          <CardInput
            id="cardNumber"
            label="Card Number"
            value={values.cardNumber}
            onChange={(v) => handleChange("cardNumber", v)}
            onBlur={() => handleBlur("cardNumber")}
            onFocus={() => setFocusedField("cardNumber")}
            error={errors.cardNumber}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
          />

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <CardInput
              id="expiryDate"
              label="Expiry Date"
              value={values.expiryDate}
              onChange={(v) => handleChange("expiryDate", v)}
              onBlur={() => handleBlur("expiryDate")}
              onFocus={() => setFocusedField("expiryDate")}
              error={errors.expiryDate}
              placeholder="MM/YY"
              maxLength={5}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
            <CardInput
              id="cvv"
              label={cardType === "amex" ? "CID (4 digits)" : "CVV"}
              value={values.cvv}
              onChange={(v) => handleChange("cvv", v)}
              onBlur={() => handleBlur("cvv")}
              onFocus={() => setFocusedField("cvv")}
              error={errors.cvv}
              placeholder={cardType === "amex" ? "1234" : "123"}
              maxLength={cvvMaxLength}
              inputMode="numeric"
              autoComplete="cc-csc"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <CardInput
                id="amount"
                label="Amount"
                value={values.amount}
                onChange={(v) => handleChange("amount", v)}
                onBlur={() => handleBlur("amount")}
                onFocus={() => setFocusedField("amount")}
                error={errors.amount}
                placeholder="100.00"
                inputMode="decimal"
              />
            </div>
            <CardInput
              id="currency"
              label="Currency"
              value={values.currency}
              onChange={(v) => handleChange("currency", v)}
              type="select"
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "INR", label: "INR (₹)" },
              ]}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!isFormValid() || isProcessing}
            whileHover={isFormValid() && !isProcessing ? { scale: 1.02 } : {}}
            whileTap={isFormValid() && !isProcessing ? { scale: 0.98 } : {}}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${isFormValid() && !isProcessing
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }
            `}
            aria-label="Pay now"
          >
            {isProcessing ? "Processing..." : `Pay ${values.currency === "USD" ? "$" : "₹"}${values.amount || "0.00"}`}
          </motion.button>
        </motion.form>
      )}
    </div>
  )
}
