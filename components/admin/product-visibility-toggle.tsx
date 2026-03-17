"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProductVisibilityToggle({
  printifyProductId,
  hidden,
}: {
  printifyProductId: string;
  hidden: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/toggle-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printifyProductId,
          hidden: !hidden,
        }),
      });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded px-2 py-1 text-xs font-medium ${
        hidden
          ? "bg-amber-100 text-amber-800"
          : "bg-[#5E825F]/20 text-[#5E825F]"
      } disabled:opacity-50`}
    >
      {loading ? "…" : hidden ? "Verborgen" : "Zichtbaar"}
    </button>
  );
}
