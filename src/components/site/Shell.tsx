import type { ReactNode } from "react";
import { headers } from "next/headers";
import type { Dictionary } from "@/content/types";
import { getContentMap, getSettings, isHttpUrl, pick } from "@/lib/settings";
import { getDictionary } from "@/content";
import { isLocale, type Locale } from "@/lib/routes";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Analytics, CookieBanner, VisitBeacon } from "./Extras";

export async function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  const [settings, content] = await Promise.all([getSettings(), getContentMap(locale)]);
  const pathname = (await headers()).get("x-pathname") || (locale === "en" ? "/en" : "/");
  const announcement = settings.announcementEnabled === "true" ? pick(content, "announcement", dict.home.announcement) : "";
  const socials = [
    ["Instagram", settings.socialInstagram],
    ["Facebook", settings.socialFacebook],
    ["X", settings.socialX],
    ["TikTok", settings.socialTiktok],
    ["YouTube", settings.socialYoutube],
  ].filter((item): item is [string, string] => isHttpUrl(item[1])).map(([label, href]) => ({ label, href }));
  const analyticsId = (settings.gaMeasurementId || process.env.NEXT_PUBLIC_GA_ID || "").trim();

  return (
    <>
      <a href="#contenido" className="absolute left-4 top-4 z-[80] -translate-y-24 rounded-full bg-white px-4 py-2 font-semibold text-ink focus:translate-y-0">
        {dict.common.skip}
      </a>
      <div className="sticky top-0 z-40">
        {announcement ? <div className="bg-blue-600 px-5 py-2 text-center text-sm font-semibold text-white">{announcement}</div> : null}
        <Header locale={locale} pathname={pathname} nav={dict.nav} />
      </div>
      <main id="contenido">{children}</main>
      <Footer locale={locale} dict={dict} socials={socials} email={settings.supportEmail} address={settings.companyAddress} />
      <CookieBanner copy={dict.cookie} analyticsId={analyticsId} />
      <Analytics id={analyticsId} />
      <VisitBeacon />
    </>
  );
}

export async function loadPublic(localeRaw: string) {
  if (!isLocale(localeRaw)) return null;
  const dict = getDictionary(localeRaw);
  const [settings, content] = await Promise.all([getSettings(), getContentMap(localeRaw)]);
  return { locale: localeRaw, dict, settings, content };
}
