"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primary = "#302D2E";
const secondary = "#FAF9F6";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Producten" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: secondary }}>
      <aside
        className="flex w-56 flex-col border-r border-black/10"
        style={{ backgroundColor: primary }}
      >
        <div className="p-4">
          <Link
            href="/admin/dashboard"
            className="font-heading text-lg font-extrabold"
            style={{ color: secondary }}
          >
            Fioresque Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "opacity-100"
                  : "opacity-80 hover:opacity-100"
              }`}
              style={{
                color: secondary,
                backgroundColor:
                  pathname === href || pathname.startsWith(href + "/")
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium opacity-80 hover:opacity-100"
              style={{ color: secondary }}
            >
              Uitloggen
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
