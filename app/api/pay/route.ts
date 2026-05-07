import { NextRequest, NextResponse } from "next/server"
import type { MockApiResponse, PaymentPayload } from "../../../types/payment"

const FAILURE_REASONS = [
  "Insufficient funds",
  "Card declined by issuer",
  "Transaction limit exceeded",
  "Invalid card details",
  "Do not honor",
]

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest): Promise<NextResponse<MockApiResponse>> {
  const payload = (await req.json()) as PaymentPayload

  const random = Math.random()
  const timestamp = new Date().toISOString()

  // 15% → timeout: delay 8 s (frontend AbortController fires at 6 s)
  if (random < 0.15) {
    await sleep(8000)
    return NextResponse.json({
      success: false,
      transactionId: payload.transactionId,
      status: "timeout",
      message: "Gateway timeout",
      timestamp,
    })
  }

  // Simulate realistic processing delay (1.5–2 s)
  await sleep(1500 + Math.random() * 500)

  // Of the remaining 85 %: ~70.6 % success → overall ~60 %; ~29.4 % failed → overall ~25 %
  const successThreshold = 0.15 + 0.85 * 0.706

  if (random < successThreshold) {
    return NextResponse.json({
      success: true,
      transactionId: payload.transactionId,
      status: "success",
      message: "Payment processed successfully",
      timestamp,
    })
  }

  const reason =
    FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)] ??
    "Payment failed"

  return NextResponse.json({
    success: false,
    transactionId: payload.transactionId,
    status: "failed",
    message: reason,
    timestamp,
  })
}