import { notFound } from "next/navigation";
import { SantiagoArt, SantoDomingoArt } from "@/components/brand";
import { CompanyInfo } from "@/components/site/CompanyInfo";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { pick } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/nosotros", loaded.dict.about.title, loaded.dict.about.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, content } = loaded;
  const about = dict.about;
  const lead = pick(content, "about_lead", about.lead);
  return (
    <>
      <PageHero kicker={about.kicker} title={about.title} description={about.description} />
      <Container className="py-14">
        <p className="max-w-3xl font-display text-2xl leading-snug font-medium">{lead}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl bg-navy-950 p-6 text-white">
            <h2 className="font-display text-2xl font-semibold">{about.missionTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/75">{about.mission}</p>
          </article>
          <article className="rounded-3xl bg-blue-600 p-6 text-white">
            <h2 className="font-display text-2xl font-semibold">{about.visionTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/90">{about.vision}</p>
          </article>
        </div>
        <h2 className="mt-12 font-display text-3xl font-semibold">{about.valuesTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {about.values.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-5 ring-1 ring-line">
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] bg-navy-950 text-white">
            <div className="h-48"><SantiagoArt /></div>
            <div className="p-5"><h3 className="font-display text-2xl">{dict.home.santiagoTitle}</h3><p className="mt-2 text-sm text-white/70">{dict.home.santiagoBody}</p></div>
          </article>
          <article className="overflow-hidden rounded-[2rem] bg-navy-950 text-white">
            <div className="h-48"><SantoDomingoArt /></div>
            <div className="p-5"><h3 className="font-display text-2xl">{dict.home.santoTitle}</h3><p className="mt-2 text-sm text-white/70">{dict.home.santoBody}</p></div>
          </article>
        </div>
        <h2 className="mt-12 font-display text-3xl font-semibold">{about.factsTitle}</h2>
        <ul className="mt-5 grid gap-3">
          {about.facts.map((fact) => <li key={fact} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">{fact}</li>)}
        </ul>
        <div className="mt-8">
          <CompanyInfo copy={dict.companyInfo} />
        </div>
      </Container>
    </>
  );
}
