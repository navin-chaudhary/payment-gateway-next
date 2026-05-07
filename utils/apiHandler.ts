import type { MockApiResponse, PaymentPayload } from "../types/payment"
 
export async function callPaymentApi(
  payload: PaymentPayload,
  signal: AbortSignal
): Promise<MockApiResponse> {
  const response = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  })
 
  if (!response.ok) {
    throw new Error(`Unexpected response: ${response.status}`)
  }
 
  return response.json() as Promise<MockApiResponse>
}
 