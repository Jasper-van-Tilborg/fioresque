import createMollieClient, { PaymentMethod } from "@mollie/api-client";

export { PaymentMethod };

export function getMollieClient() {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) throw new Error("MOLLIE_API_KEY is not set");
  return createMollieClient({ apiKey: key });
}
