import { notFound } from "next/navigation";
import { FarePlayground } from "@/components/FarePlayground";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { pick } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/tarifas", loaded.dict.fares.title, loaded.dict.fares.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, content } = loaded;
  return (
    <>
      <PageHero kicker={dict.fares.kicker} title={dict.fares.title} description={dict.fares.description} />
      <Container className="grid gap-8 py-14 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-4">
          {dict.fares.points.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-5 ring-1 ring-line">
              <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-slate">{item.body}</p>
            </article>
          ))}
          <article className="rounded-3xl bg-white p-5 ring-1 ring-line">
            <h2 className="font-display text-2xl font-semibold">{dict.fares.factorsTitle}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate">{pick(content, "pricing_note", dict.fares.pricingNote)}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 ring-1 ring-line">
            <h2 className="font-display text-2xl font-semibold">{dict.fares.paymentTitle}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate">{pick(content, "payment_note", dict.fares.paymentNote)}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 ring-1 ring-line">
            <h2 className="font-display text-2xl font-semibold">{dict.fares.cancelTitle}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate">{pick(content, "cancellation_note", dict.fares.cancellationNote)}</p>
          </article>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-4 font-display text-3xl font-semibold">{dict.fares.playgroundTitle}</h2>
          <FarePlayground copy={dict.fares} />
        </div>
      </Container>
    </>
  );
}
