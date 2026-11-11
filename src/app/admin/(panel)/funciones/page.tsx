import { prisma } from "@/lib/db";
import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";
import { saveSafety } from "@/server/admin";

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const query = await searchParams;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const features = await prisma.safetyFeature.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">{copy.safety.title}</h1>
      <p className="max-w-2xl text-sm text-slate">{copy.safety.help}</p>
      {query.aviso === "guardado" ? <p className="text-sm text-success">{copy.common.saved}</p> : null}
      {features.map((feature) => (
        <form key={feature.id} action={saveSafety} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
          <input type="hidden" name="id" value={feature.id} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{locale === "en" ? feature.titleEn : feature.titleEs}</h2>
            <select className="field max-w-xs" name="status" defaultValue={feature.status} aria-label={copy.common.status}>
              <option value="soon">{copy.safety.soon}</option>
              <option value="partial">{copy.safety.partial}</option>
              <option value="live">{copy.safety.live}</option>
            </select>
          </div>
          <input className="field" name="titleEs" defaultValue={feature.titleEs} aria-label={copy.safety.spanishTitle} />
          <textarea className="field min-h-20" name="bodyEs" defaultValue={feature.bodyEs} aria-label={copy.safety.spanishBody} />
          <input className="field" name="titleEn" defaultValue={feature.titleEn} aria-label={copy.safety.englishTitle} />
          <textarea className="field min-h-20" name="bodyEn" defaultValue={feature.bodyEn} aria-label={copy.safety.englishBody} />
          <button className="min-h-11 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white">{copy.safety.save}</button>
        </form>
      ))}
    </div>
  );
}
