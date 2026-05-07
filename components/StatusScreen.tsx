import { motion, AnimatePresence } from "framer-motion"
import type { PaymentStatus } from "@/types/payment"

interface StatusScreenProps {
  status: PaymentStatus
  failureReason: string | null
  retryAttempts: number
  maxRetries: number
  canRetry: boolean
  onRetry: () => void
  onReset: () => void
}

const statusConfig = {
  processing: {
    icon: null,
    title: "Processing Payment",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  success: {
    icon: (
      <motion.svg
        className="w-16 h-16 text-emerald-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.svg>
    ),
    title: "Payment Successful!",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  failed: {
    icon: (
      <svg className="w-16 h-16 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Payment Failed",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  timeout: {
    icon: (
      <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Request Timed Out",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  idle: null,
}

function SpinnerIcon() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export function StatusScreen({
  status,
  failureReason,
  retryAttempts,
  maxRetries,
  canRetry,
  onRetry,
  onReset,
}: StatusScreenProps) {
  if (status === "idle") return null

  const config = statusConfig[status]
  if (!config) return null

  const showRetry = (status === "failed" || status === "timeout") && canRetry
  const attemptsLeft = maxRetries - retryAttempts

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border ${config.bgColor} ${config.borderColor} p-8 flex flex-col items-center gap-5 text-center`}
      >
        <div>
          {status === "processing" ? <SpinnerIcon /> : config.icon}
        </div>

        <div>
          <h3 className={`text-xl font-bold ${config.color}`}>
            {config.title}
          </h3>

          {status === "processing" && (
            <p className="text-white/50 text-sm mt-1">
              Please wait while we process your payment...
            </p>
          )}

          {failureReason && status !== "processing" && (
            <p className="text-white/60 text-sm mt-2">
              {failureReason}
            </p>
          )}

          {(status === "failed" || status === "timeout") && (
            <p className="text-white/40 text-xs mt-2">
              Attempt {retryAttempts} of {maxRetries}
              {!canRetry && " — Maximum attempts reached"}
            </p>
          )}

          {showRetry && (
            <p className="text-white/40 text-xs mt-1">
              {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>

        {status !== "processing" && (
          <div className="flex gap-3 flex-wrap justify-center">
            {showRetry && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetry}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10"
              >
                Retry Payment
              </motion.button>
            )}

            {status === "success" || !canRetry ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
              >
                {status === "success" ? "New Payment" : "Start Over"}
              </motion.button>
            ) : null}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
