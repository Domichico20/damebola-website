import { cookies } from "next/headers";
import type { AdminLocale } from "@/content/admin-ui";

export const ADMIN_LANG_COOKIE = "db_admin_lang";

export async function getAdminLocale(): Promise<AdminLocale> {
  const jar = await cookies();
  return jar.get(ADMIN_LANG_COOKIE)?.value === "en" ? "en" : "es";
}

export function adminDateLocale(locale: AdminLocale) {
  return locale === "en" ? "en-US" : "es-DO";
}
