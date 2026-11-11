"use client";

import { useRouter } from "next/navigation";
import { setAdminLanguage } from "@/server/admin-locale";
import type { AdminLocale } from "@/content/admin-ui";

export function LanguageSwitch({ locale, label }: { locale: AdminLocale; label: string }) {
  const router = useRouter();
  const item = (active: boolean) =>
    active ? "rounded-full bg-navy-950 px-2.5 py-1 text-white" : "rounded-full px-2.5 py-1 text-slate";
  return (
    <form
      action={async (formData) => {
        await setAdminLanguage(formData);
        router.refresh();
      }}
      className="flex items-center gap-2"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <div className="flex rounded-full bg-paper p-1 text-xs font-bold ring-1 ring-line">
        <button className={item(locale === "es")} name="lang" value="es" type="submit" aria-current={locale === "es" ? "true" : undefined} lang="es">ES</button>
        <button className={item(locale === "en")} name="lang" value="en" type="submit" aria-current={locale === "en" ? "true" : undefined} lang="en">EN</button>
      </div>
    </form>
  );
}
