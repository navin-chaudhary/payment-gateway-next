import { motion } from "framer-motion"
import type { CardType } from "@/types/payment"

interface CardPreviewProps {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cardType: CardType
  focusedField?: string
}

function CardLogo({ cardType }: { cardType: CardType }) {
  if (cardType === "visa") {
    return (
      <span className="text-white font-black text-xl tracking-widest italic">
        VISA
      </span>
    )
  }
  if (cardType === "mastercard") {
    return (
      <div className="flex items-center gap-0">
        <div className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
        <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-90 -ml-4" />
      </div>
    )
  }
  if (cardType === "amex") {
    return (
      <span className="text-white font-black text-sm tracking-widest bg-blue-600 px-2 py-1 rounded">
        AMEX
      </span>
    )
  }
  return (
    <div className="w-10 h-7 rounded border-2 border-white/30 flex items-center justify-center">
      <div className="w-6 h-4 bg-white/20 rounded-sm" />
    </div>
  )
}

function ChipIcon() {
  return (
    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-200/50 grid grid-cols-3 grid-rows-3 gap-px p-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-yellow-200/60 rounded-sm" />
      ))}
    </div>
  )
}

export function CardPreview({
  cardNumber,
  cardholderName,
  expiryDate,
  cardType,
  focusedField,
}: CardPreviewProps) {
  const displayNumber = cardNumber || "•••• •••• •••• ••••"
  const paddedNumber = displayNumber.padEnd(19, "•")

  const gradient =
    cardType === "visa"
      ? "from-blue-700 via-blue-600 to-indigo-700"
      : cardType === "mastercard"
      ? "from-gray-800 via-gray-700 to-gray-900"
      : cardType === "amex"
      ? "from-slate-700 via-slate-600 to-blue-800"
      : "from-purple-900 via-purple-800 to-indigo-900"

  return (
    <motion.div
      className={`relative w-full max-w-sm mx-auto rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-2xl overflow-hidden`}
      style={{ aspectRatio: "1.586" }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <ChipIcon />
          <motion.div
            key={cardType}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardLogo cardType={cardType} />
          </motion.div>
        </div>

        {/* Card number */}
        <motion.div
          className={`font-mono text-white text-lg tracking-widest transition-all duration-200 ${
            focusedField === "cardNumber" ? "opacity-100" : "opacity-90"
          }`}
        >
          {paddedNumber.slice(0, 19)}
        </motion.div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              Card Holder
            </p>
            <motion.p
              className="text-white font-medium text-sm uppercase tracking-wider truncate max-w-[160px]"
              key={cardholderName}
            >
              {cardholderName || "FULL NAME"}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              Expires
            </p>
            <p className="text-white font-medium text-sm font-mono">
              {expiryDate || "MM/YY"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
