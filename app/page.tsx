import { Toaster } from "react-hot-toast"
import { PaymentForm } from "@/components/PaymentForm"
import { TransactionHistory } from "@/components/TransactionHistory"

function Home() {
  return (
    <div className="min-h-screen bg-[#0c0b1e] text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1830",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "14px",
          },
        }}
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0c0b1e]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl px-4 py-4 mx-auto">
          <div className="flex items-center gap-2.5">
            {/* Card icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-white">Payment Gateway</h1>
            </div>
          </div>

          {/* SSL badge */}
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd" />
            </svg>
            Secure
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col max-w-2xl gap-8 px-4 py-8 mx-auto">
        {/* Page title */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Complete Your Payment</h2>
          <p className="mt-1 text-sm text-white/40">
            Enter your card details below. All transactions are encrypted and secure.
          </p>
        </div>

        {/* Payment form */}
        <PaymentForm />

        {/* Transaction history */}
        <TransactionHistory />
      </main>

      {/* Footer */}
      <footer className="py-6 mt-8 border-t border-white/5">
        <div className="flex flex-col items-center justify-between max-w-2xl gap-2 px-4 mx-auto text-xs sm:flex-row text-white/20">
          <span>© 2025 Payment Gateway</span>
          <div className="flex items-center gap-3">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
