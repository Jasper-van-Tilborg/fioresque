"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderDetailClient({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Opslaan mislukt");
        setSaving(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Netwerkfout");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleUpdate} className="mt-4">
      {error && (
        <p className="mb-2 text-sm text-red-600">{error}</p>
      )}
      <div className="flex items-end gap-2">
        <div>
          <label htmlFor="status" className="mb-1 block text-xs text-[#302D2E]/70">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border border-[#302D2E]/20 bg-[#FAF9F6] px-3 py-2 text-sm text-[#302D2E]"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="sent_to_printify">Sent to Printify</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-[#5E825F] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E825F]/90 disabled:opacity-50"
        >
          {saving ? "Opslaan…" : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
