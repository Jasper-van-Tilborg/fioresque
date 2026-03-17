const PRINTIFY_BASE = "https://api.printify.com/v1";

function getHeaders(): HeadersInit {
  const key = process.env.PRINTIFY_API_KEY;
  if (!key) throw new Error("PRINTIFY_API_KEY is not set");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json;charset=utf-8",
    "User-Agent": "FioresqueArtwear/1.0",
  };
}

type LineItemInput = {
  product_id: string;
  variant_id: number;
  quantity: number;
  external_id?: string;
};

type AddressTo = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

type SubmitOrderBody = {
  external_id: string;
  line_items: LineItemInput[];
  shipping_method: number;
  address_to: AddressTo;
};

type PrintifyOrderResponse = {
  id: string;
  [key: string]: unknown;
};

export async function submitPrintifyOrder(
  shopId: string,
  externalId: string,
  lineItems: { printifyProductId: string; variantId: number; quantity: number }[],
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    country: string;
    address: string;
    city: string;
    postalCode: string;
  }
): Promise<PrintifyOrderResponse> {
  const body: SubmitOrderBody = {
    external_id: externalId,
    shipping_method: 1,
    line_items: lineItems.map((item, i) => ({
      product_id: item.printifyProductId,
      variant_id: item.variantId,
      quantity: item.quantity,
      external_id: `line-${i}-${externalId}`,
    })),
    address_to: {
      first_name: address.firstName,
      last_name: address.lastName,
      email: address.email,
      phone: address.phone ?? undefined,
      country: address.country,
      address1: address.address,
      city: address.city,
      zip: address.postalCode,
    },
  };

  const res = await fetch(`${PRINTIFY_BASE}/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify order error ${res.status}: ${text}`);
  }

  return res.json() as Promise<PrintifyOrderResponse>;
}
