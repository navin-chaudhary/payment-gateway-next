# 💳 Payment Gateway UI — Next.js

A production-ready Payment Gateway UI built with **Next.js 16 (App Router)** and **TypeScript** that simulates a real-world payment flow — no third-party payment SDK required.

---

## ✨ Features

- **Live Card Preview** — card number, name, and expiry update in real time with card-type detection (Visa, Mastercard, Amex)
- **Smart Validation** — real-time field-level validation on change and blur; submit locked until form is valid
- **Payment Lifecycle** — Idle → Processing → Success / Failed / Timeout with animated transitions
- **Mock API** — probabilistic outcomes: 60% success, 25% failure (with reasons), 15% timeout
- **AbortController Timeout** — frontend cancels the request after 6 s; API responds after 8 s on timeout paths
- **Retry Logic** — up to 3 attempts with the same transaction ID (idempotency via `crypto.randomUUID`)
- **Transaction History** — persisted to `localStorage`, survives page refresh, click to view full details
- **Toast Notifications** — `react-hot-toast` for success, failure, and timeout feedback
- **Framer Motion Animations** — card entrance, status transitions, list items
- **Fully Accessible** — all inputs labelled, `aria-describedby` on errors, `aria-invalid`, `role="alert"`
- **Responsive** — 375 px mobile through 1280 px desktop

---

## 🗂️ Project Structure

```
payment-gateway-next/
├── app/
│   ├── api/
│   │   └── pay/
│   │       └── route.ts          # Next.js API route (mock gateway)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Root page
│
├── components/
│   ├── CardInput.tsx             # Reusable labelled input / select
│   ├── CardPreview.tsx           # Live animated card visual
│   ├── PaymentForm.tsx           # Main form + orchestration
│   ├── StatusScreen.tsx          # Processing / Success / Failed / Timeout UI
│   └── TransactionHistory.tsx    # Collapsible history list + detail modal
│
├── hooks/
│   ├── usePayment.ts             # API call, lifecycle, retry, abort logic
│   └── useFormValidation.ts      # Form state, field formatting, validation
│
├── store/
│   └── paymentStore.ts           # Zustand global store + localStorage persistence
│
├── types/
│   └── payment.ts                # PaymentPayload, Transaction, PaymentStatus, CardType, …
│
└── utils/
    ├── cardUtils.ts              # formatCardNumber, detectCardType, validateCardDetails, …
    └── apiHandler.ts             # mockPaymentApi (used client-side; see note below)
```

---

## 🚀 Setup & Running

### Prerequisites

- Node.js **18+**
- npm / yarn / pnpm / bun

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔧 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| State Management | Zustand 5 |
| Animations | Framer Motion 12 |
| Notifications | react-hot-toast |
| Styling | Tailwind CSS 4 |

---

## 🃏 Card Type Detection

| Brand | Prefix |
|---|---|
| Visa | Starts with `4` |
| Mastercard | Starts with `5` |
| Amex | Starts with `34` or `37` |

CVV length is automatically adjusted: **4 digits** for Amex, **3 digits** for all others.

---

## 💰 Mock Payment API

`POST /api/pay` accepts a `PaymentPayload` and returns a probabilistic outcome:

| Outcome | Probability | Behaviour |
|---|---|---|
| ✅ Success | ~60% | Responds after ~1.5–2 s |
| ❌ Failed | ~25% | Responds with a failure reason (e.g. "Insufficient funds") |
| ⏱ Timeout | ~15% | Delays 8 s — frontend `AbortController` fires at 6 s |

---

## 🔄 Payment Flow

```
User fills form
      │
      ▼
 Form validates (real-time)
      │
      ▼
  Submit → generate crypto.randomUUID() transactionId
      │
      ▼
  Status: Processing
  AbortController + 6 s timeout
      │
      ├─ Success ──────────► Status: Success → toast ✅
      │
      ├─ Failed  ──────────► Status: Failed  → toast ❌
      │                        ↳ Retry (same txId, max 3×)
      │
      └─ Timeout (abort) ──► Status: Timeout → toast ⏱
                               ↳ Retry (same txId, max 3×)
```

---

## ♻️ Retry Logic

- Available on **Failed** and **Timeout** states
- Maximum **3 attempts** total
- Same `transactionId` is reused across all retries (idempotency)
- Attempt counter shown: *"Attempt 2 of 3"*
- Retry button hidden / disabled after 3 attempts; "Start Over" shown instead

---

## 💾 Transaction History

- Stored in `localStorage` under the key `payment_gateway_transactions`
- Loaded on mount — survives page refresh
- Each entry shows: amount, truncated transaction ID, status badge, timestamp
- Click any row to open a detail modal with full information

---

## ♿ Accessibility

- Every input has an explicit `<label htmlFor>` association
- Error messages use `id` + `aria-describedby` + `role="alert"`
- Inputs carry `aria-invalid` when in error state
- Transaction history toggle uses `aria-expanded` + `aria-controls`
- Interactive elements use semantic `<button>` elements

---

## 📱 Responsiveness

- Mobile: 375 px (single-column, stacked layout)
- Desktop: 1280 px (centred max-width container)
- Expiry / CVV fields use a two-column grid; Amount / Currency use a 3-column grid

---
