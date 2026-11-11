export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export const publicPaths = [
  "/",
  "/como-funciona",
  "/viaja",
  "/conduce",
  "/seguridad",
  "/tarifas",
  "/nosotros",
  "/ayuda",
  "/contacto",
  "/descargar",
  "/legal/terminos",
  "/legal/privacidad",
  "/legal/terminos-conductores",
  "/legal/terminos-pasajeros",
  "/legal/cookies",
  "/legal/comunidad",
  "/legal/politica-seguridad",
  "/legal/eliminacion-datos",
] as const;

export function localize(locale: string, href: string) {
  if (!href.startsWith("/")) return href;
  if (locale === "en") return href === "/" ? "/en" : `/en${href}`;
  return href;
}

export function barePath(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

export function swapLocale(pathname: string, target: Locale) {
  return localize(target, barePath(pathname));
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.damebolaapp.com").replace(/\/$/, "");
}
