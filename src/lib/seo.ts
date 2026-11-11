import type { Metadata } from "next";
import { siteUrl, localize, type Locale } from "@/lib/routes";

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const base = siteUrl();
  const esPath = path === "/" ? "/" : path;
  const enPath = path === "/" ? "/en" : `/en${path}`;
  const canonical = locale === "en" ? `${base}${enPath}` : `${base}${esPath === "/" ? "/" : esPath}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: `${base}${esPath}`,
        en: `${base}${enPath}`,
        "x-default": `${base}${esPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "DameBola",
      locale: locale === "en" ? "en_US" : "es_DO",
      type: "website",
    },
  };
}

export function jsonLd(email: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DameBola",
    url: siteUrl(),
    logo: `${siteUrl()}/brand/logo.png`,
    email,
    slogan: "DameBola: Dale pa' allá con lo de acá.",
    areaServed: { "@type": "Country", name: "Dominican Republic" },
  };
}

export { localize };
