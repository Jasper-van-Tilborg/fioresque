"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = getTotal();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Je winkelwagen is leeg.");
      return;
    }
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          address: formData.get("address"),
          city: formData.get("city"),
          postalCode: formData.get("postalCode"),
          country: formData.get("country") || "NL",
          phone: formData.get("phone") || null,
          items: items.map((i) => ({
            productId: i.productId,
            printifyProductId: i.printifyProductId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setLoading(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError("Geen betaallink ontvangen.");
    } catch {
      setError("Netwerkfout. Probeer het opnieuw.");
    }
    setLoading(false);
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-primary">Checkout</h1>
        <p className="mt-4 text-primary/80">Je winkelwagen is leeg.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/shop")}
        >
          Naar shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-primary">Checkout</h1>
      <p className="mt-2 text-primary/70">
        Totaal: &euro; {(total / 100).toFixed(2)} (excl. verzendkosten)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Voornaam"
            name="firstName"
            required
            autoComplete="given-name"
          />
          <Input
            label="Achternaam"
            name="lastName"
            required
            autoComplete="family-name"
          />
        </div>
        <Input
          label="E-mailadres"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          label="Adres"
          name="address"
          required
          autoComplete="street-address"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Postcode" name="postalCode" required autoComplete="postal-code" />
          <Input label="Plaats" name="city" required autoComplete="address-level2" />
        </div>
        <Input
          label="Land"
          name="country"
          required
          autoComplete="country-name"
          defaultValue="NL"
        />
        <Input label="Telefoon (optioneel)" name="phone" type="tel" autoComplete="tel" />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Bezig…" : "Betaal met iDEAL"}
        </Button>
      </form>
    </div>
  );
}
