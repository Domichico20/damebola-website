import { notFound } from "next/navigation";
import { Button, Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/como-funciona", loaded.dict.how.title, loaded.dict.how.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale } = loaded;
  return (
    <>
      <PageHero kicker={dict.how.kicker} title={dict.how.title} description={dict.how.description}>
        <Button href={localize(locale, "/descargar")}>{dict.how.cta}</Button>
      </PageHero>
      <Container className="py-14">
        <ol className="grid gap-4">
          {dict.how.steps.map((step, index) => (
            <li key={step.title} className="grid gap-4 rounded-3xl bg-white p-5 ring-1 ring-line md:grid-cols-[auto_1fr] md:p-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 font-display text-xl font-semibold text-white">{index + 1}</span>
              <div>
                <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-slate">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-slate">{dict.common.illustrative}</p>
      </Container>
    </>
  );
}
