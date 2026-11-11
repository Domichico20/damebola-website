import { getDictionary } from "@/content";
import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";
import { getContentMap, getSettings } from "@/lib/settings";
import { saveContent } from "@/server/admin";

const fields = [
  ["hero_title", "heroTitle"],
  ["hero_accent", "heroAccent"],
  ["hero_description", "heroDescription"],
  ["announcement", "announcement"],
  ["promotion_kicker", "promoKicker"],
  ["promotion_title", "promoTitle"],
  ["promotion_body", "promoBody"],
  ["promotion_href", "promoHref"],
  ["early_title", "earlyTitle"],
  ["early_description", "earlyDescription"],
  ["about_lead", "aboutLead"],
  ["driver_requirements", "requirements"],
  ["pricing_note", "pricingNote"],
  ["payment_note", "paymentNote"],
  ["cancellation_note", "cancellationNote"],
] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ locale?: string; aviso?: string }> }) {
  const query = await searchParams;
  const contentLocale = query.locale === "en" ? "en" : "es";
  const ui = adminCopy(await getAdminLocale());
  const dict = getDictionary(contentLocale);
  const [content, settings] = await Promise.all([getContentMap(contentLocale), getSettings()]);
  const placeholders: Record<string, string> = {
    heroTitle: dict.home.heroTitle,
    heroAccent: dict.home.heroAccent,
    heroDescription: dict.home.heroDescription,
    announcement: dict.home.announcement,
    promoKicker: dict.home.promoKicker,
    promoTitle: dict.home.promoTitle,
    promoBody: dict.home.promoBody,
    promoHref: dict.home.promoHref,
    earlyTitle: dict.home.earlyTitle,
    earlyDescription: dict.home.earlyDescription,
    aboutLead: dict.about.lead,
    requirements: dict.drive.requirements,
    pricingNote: dict.fares.pricingNote,
    paymentNote: dict.fares.paymentNote,
    cancellationNote: dict.fares.cancellationNote,
  };
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{ui.content.title}</h1>
      <p className="mt-2 text-sm text-slate">{ui.content.help}</p>
      <p className="mt-4 text-sm font-semibold">{ui.content.editing}</p>
      <div className="mt-2 flex gap-2 text-sm font-semibold">
        <a className={contentLocale === "es" ? "rounded-full bg-navy-900 px-3 py-1 text-white" : "rounded-full bg-white px-3 py-1 ring-1 ring-line"} href="/admin/contenido?locale=es">Español</a>
        <a className={contentLocale === "en" ? "rounded-full bg-navy-900 px-3 py-1 text-white" : "rounded-full bg-white px-3 py-1 ring-1 ring-line"} href="/admin/contenido?locale=en">English</a>
      </div>
      {query.aviso === "guardado" ? <p className="mt-3 text-sm text-success">{ui.content.saved}</p> : null}
      <form action={saveContent} className="mt-4 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="locale" value={contentLocale} />
        <label className="flex gap-2 text-sm"><input type="checkbox" name="announcementEnabled" defaultChecked={settings.announcementEnabled === "true"} /> {ui.content.announcement}</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" name="promotionEnabled" defaultChecked={settings.promotionEnabled === "true"} /> {ui.content.promotion}</label>
        {fields.map(([key, placeholder]) => (
          <label key={key} className="text-sm font-semibold">{ui.content.fields[key]}
            <textarea className="field min-h-20" name={key} defaultValue={content[key] || ""} placeholder={placeholders[placeholder]} />
          </label>
        ))}
        <button className="min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">{ui.content.save}</button>
      </form>
    </div>
  );
}
