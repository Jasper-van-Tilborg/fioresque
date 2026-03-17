import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-secondary mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-extrabold text-primary"
            >
              Fioresque Artwear
            </Link>
            <p className="mt-1 text-sm text-primary/70">
              Unieke designs op kwaliteitskleding.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer navigatie">
            <Link href="/shop" className="text-primary/70 hover:text-primary">
              Shop
            </Link>
            <Link href="/over-ons" className="text-primary/70 hover:text-primary">
              Over ons
            </Link>
            <Link href="/cart" className="text-primary/70 hover:text-primary">
              Winkelwagen
            </Link>
          </nav>
        </div>
        <p className="mt-6 border-t border-primary/10 pt-6 text-center text-sm text-primary/60">
          &copy; {new Date().getFullYear()} Fioresque Artwear. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}
