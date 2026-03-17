import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Fioresque Artwear – Unieke designs op kwaliteitskleding",
  description:
    "Fioresque Artwear is een modern kledingmerk met unieke designs op kleding. Print-on-demand kwaliteit via een strakke, verzorgde webshop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${plusJakarta.variable} ${outfit.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
