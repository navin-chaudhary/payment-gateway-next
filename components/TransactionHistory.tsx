"use client"
import { useState,useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePaymentStore } from "@/store/paymentStore"
import type { Transaction } from "@/types/payment"

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  success:    { label: "Success",    dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  failed:     { label: "Failed",     dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-500/10"     },
  timeout:    { label: "Timeout",    dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-500/10"   },
  processing: { label: "Processing", dot: "bg-blue-400",    text: "text-blue-400",    bg: "bg-blue-500/10"    },
  idle:       { label: "Idle",       dot: "bg-gray-400",    text: "text-gray-400",    bg: "bg-gray-500/10"    },
}

function formatCurrency(amount: string, currency: "INR" | "USD") {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  return currency === "USD"
    ? `$${num.toFixed(2)}`
    : `₹${num.toFixed(2)}`
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function TransactionDetailModal({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  const st = STATUS_STYLES[transaction.status] ?? STATUS_STYLES.idle

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-sm bg-[#12102a] border border-white/10 rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-white font-bold text-lg mb-5">Transaction Details</h3>

        <div className="flex flex-col gap-3.5">
          <DetailRow label="Transaction ID">
            <span className="font-mono text-xs text-white/70 break-all">{transaction.transactionId}</span>
          </DetailRow>
          <DetailRow label="Status">
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${st.text}`}>
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </DetailRow>
          <DetailRow label="Amount">
            <span className="text-white font-semibold">
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
          </DetailRow>
          <DetailRow label="Cardholder">{transaction.cardholderName}</DetailRow>
          <DetailRow label="Card">
            <span className="uppercase text-white/70">
              {transaction.cardType} •••• {transaction.cardLastFour}
            </span>
          </DetailRow>
          <DetailRow label="Attempts">{transaction.attempts}</DetailRow>
          <DetailRow label="Date">{formatTimestamp(transaction.timestamp)}</DetailRow>
          {transaction.failureReason && (
            <DetailRow label="Reason">
              <span className="text-red-400 text-xs">{transaction.failureReason}</span>
            </DetailRow>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-white/40 text-xs uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-white text-xs text-right">{children}</span>
    </div>
  )
}

export function TransactionHistory() {
  const { transactionHistory, selectedTransactionId, setSelectedTransactionId } = usePaymentStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const selectedTx = transactionHistory.find(
    (tx) => tx.transactionId === selectedTransactionId
  ) ?? null

  if (!mounted || transactionHistory.length === 0) return null

  return (
    <>
      {/* Detail Modal */}
      <AnimatePresence>
      {selectedTx && (
  <AnimatePresence mode="wait">
    <TransactionDetailModal
      transaction={selectedTx}
      onClose={() => setSelectedTransactionId(null)}
    />
  </AnimatePresence>
)}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-white/60 text-sm font-medium uppercase tracking-wider mb-3 hover:text-white/90 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="tx-history-list"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Transaction History
            <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
              {transactionHistory.length}
            </span>
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              id="tx-history-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2 overflow-hidden"
            >
              {transactionHistory.map((tx, idx) => {
                const st = STATUS_STYLES[tx.status] ?? STATUS_STYLES.idle
                return (
                  <motion.li
                    key={tx.transactionId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <button
                      onClick={() => setSelectedTransactionId(tx.transactionId)}
                      className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all duration-200 group"
                      aria-label={`View transaction ${tx.transactionId.slice(0, 8)}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Left */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {formatCurrency(tx.amount, tx.currency)}
                            </p>
                            <p className="text-white/40 text-xs font-mono truncate">
                              {tx.transactionId.slice(0, 18)}…
                            </p>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className={`text-xs font-medium ${st.text}`}>{st.label}</p>
                            <p className="text-white/30 text-xs">{formatTimestamp(tx.timestamp)}</p>
                          </div>
                          <svg
                            className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
