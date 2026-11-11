import { notFound } from "next/navigation";
import { PhoneMock } from "@/components/brand";
import { Button, Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/viaja", loaded.dict.ride.title, loaded.dict.ride.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale } = loaded;
  return (
    <>
      <PageHero kicker={dict.ride.kicker} title={dict.ride.title} description={dict.ride.description}>
        <Button href={localize(locale, "/descargar")}>{dict.ride.cta}</Button>
        <Button href={localize(locale, "/como-funciona")} variant="secondary">{dict.ride.secondary}</Button>
      </PageHero>
      <section className="bg-navy-950">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2">
          <PhoneMock copy={dict.ride} />
          <div className="grid gap-4">
            {dict.ride.benefits.map((item) => (
              <article key={item.title} className="rounded-3xl bg-white p-5 ring-1 ring-line">
                <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
