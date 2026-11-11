import { notFound } from "next/navigation";
import { Container, PageHero, StatusPill } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/seguridad", loaded.dict.safety.title, loaded.dict.safety.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale } = loaded;
  const features = await prisma.safetyFeature.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  return (
    <>
      <PageHero kicker={dict.safety.kicker} title={dict.safety.title} description={dict.safety.description} />
      <Container className="space-y-4 py-14">
        <p className="rounded-3xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">{dict.safety.emergency}</p>
        <p className="rounded-3xl bg-white px-5 py-4 text-sm leading-relaxed ring-1 ring-line">{dict.safety.noInsurance}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => {
            const status = feature.status === "live" || feature.status === "partial" ? feature.status : "soon";
            const label = status === "live" ? dict.common.available : status === "partial" ? dict.common.partial : dict.common.soon;
            return (
              <article key={feature.id} className="rounded-3xl bg-white p-5 ring-1 ring-line">
                <StatusPill status={status} label={label} />
                <h2 className="mt-3 font-display text-2xl font-semibold">{locale === "en" ? feature.titleEn : feature.titleEs}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">{locale === "en" ? feature.bodyEn : feature.bodyEs}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </>
  );
}
