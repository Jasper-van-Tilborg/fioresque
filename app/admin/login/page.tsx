"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Inloggen mislukt");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Netwerkfout");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#302D2E]/10 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-xl font-extrabold text-[#302D2E]">
          Admin inloggen
        </h1>
        <p className="mt-1 text-sm text-[#302D2E]/70">
          Fioresque Artwear beheer
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#302D2E]">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#302D2E]/20 bg-[#FAF9F6] px-3 py-2 text-[#302D2E] focus:border-[#5E825F] focus:outline-none focus:ring-1 focus:ring-[#5E825F]"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#5E825F] px-4 py-2 font-medium text-white hover:bg-[#5E825F]/90 disabled:opacity-50"
          >
            {loading ? "Bezig…" : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
