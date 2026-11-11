import { en } from "./en";
import { es } from "./es";
import type { Locale } from "@/lib/routes";

export function getDictionary(locale: Locale | string) {
  return locale === "en" ? en : es;
}
