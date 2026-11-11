import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.damebolaapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "DameBola — Tu destino, tu precio", template: "%s · DameBola" },
  description: "Plataforma dominicana de transporte. Tú propones la tarifa y el conductor puede aceptar o negociar.",
  applicationName: "DameBola",
  authors: [{ name: "DameBola" }],
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "es";
  return (
    <html lang={locale} className={`${outfit.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
