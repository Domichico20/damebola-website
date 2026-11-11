import { getDictionary } from "@/content";
import { getContentMap, getSettings } from "@/lib/settings";
import { saveContent } from "@/server/admin";

const fields = [
  ["hero_title", "Título del inicio", "heroTitle"],
  ["hero_accent", "Frase destacada", "heroAccent"],
  ["hero_description", "Descripción del inicio", "heroDescription"],
  ["announcement", "Barra de anuncio", "announcement"],
  ["promotion_kicker", "Promoción: etiqueta", "promoKicker"],
  ["promotion_title", "Promoción: título", "promoTitle"],
  ["promotion_body", "Promoción: texto", "promoBody"],
  ["promotion_href", "Promoción: enlace interno", "promoHref"],
  ["early_title", "Lista de lanzamiento: título", "earlyTitle"],
  ["early_description", "Lista de lanzamiento: texto", "earlyDescription"],
  ["about_lead", "Texto principal de Nosotros", "aboutLead"],
  ["driver_requirements", "Requisitos de conductores", "requirements"],
  ["pricing_note", "Nota de factores de precio", "pricingNote"],
  ["payment_note", "Nota de métodos de pago", "paymentNote"],
  ["cancellation_note", "Nota de cancelación", "cancellationNote"],
] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ locale?: string; aviso?: string }> }) {
  const query = await searchParams;
  const locale = query.locale === "en" ? "en" : "es";
  const dict = getDictionary(locale);
  const [content, settings] = await Promise.all([getContentMap(locale), getSettings()]);
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
      <h1 className="font-display text-3xl font-semibold">Contenido</h1>
      <p className="mt-2 text-sm text-slate">Un campo vacío vuelve al texto original del sitio. No publiques cifras, comisiones o fechas que no estén confirmadas.</p>
      <div className="mt-3 flex gap-2 text-sm font-semibold">
        <a className={locale === "es" ? "rounded-full bg-navy-900 px-3 py-1 text-white" : "rounded-full bg-white px-3 py-1 ring-1 ring-line"} href="/admin/contenido?locale=es">Español</a>
        <a className={locale === "en" ? "rounded-full bg-navy-900 px-3 py-1 text-white" : "rounded-full bg-white px-3 py-1 ring-1 ring-line"} href="/admin/contenido?locale=en">English</a>
      </div>
      {query.aviso === "guardado" ? <p className="mt-3 text-sm text-success">Contenido guardado.</p> : null}
      <form action={saveContent} className="mt-4 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="locale" value={locale} />
        <label className="flex gap-2 text-sm"><input type="checkbox" name="announcementEnabled" defaultChecked={settings.announcementEnabled === "true"} /> Mostrar barra de anuncio</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" name="promotionEnabled" defaultChecked={settings.promotionEnabled === "true"} /> Mostrar promoción del inicio</label>
        {fields.map(([key, label, placeholder]) => (
          <label key={key} className="text-sm font-semibold">{label}
            <textarea className="field min-h-20" name={key} defaultValue={content[key] || ""} placeholder={placeholders[placeholder]} />
          </label>
        ))}
        <button className="min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">Guardar contenido</button>
      </form>
    </div>
  );
}
