import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/SimpleForms";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { getLegalDoc, legalSlugs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return legalSlugs.flatMap((slug) => [{ locale: "es", slug }, { locale: "en", slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loaded = await loadPublic(locale);
  const doc = loaded ? getLegalDoc(loaded.locale, slug) : null;
  if (!loaded || !doc) return {};
  return pageMetadata(loaded.locale, `/legal/${slug}`, doc.title, doc.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeRaw, slug } = await params;
  const loaded = await loadPublic(localeRaw);
  if (!loaded) notFound();
  const doc = getLegalDoc(loaded.locale, slug);
  if (!doc) notFound();
  const deletion = slug === "eliminacion-datos";
  return (
    <>
      <PageHero kicker={loaded.dict.legal.kicker} title={doc.title} description={doc.description} />
      <Container className="py-14">
        <p className="text-sm text-slate">{loaded.dict.legal.updated}</p>
        <article className="mt-8 max-w-3xl space-y-4">
          {doc.blocks.map((block, index) => {
            if (block.kind === "h") return <h2 key={index} className="pt-4 font-display text-2xl font-semibold">{block.text}</h2>;
            if (block.kind === "ul") return <ul key={index} className="list-disc space-y-2 pl-5 text-slate">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            return <p key={index} className="leading-relaxed text-slate">{block.text}</p>;
          })}
        </article>
        {deletion ? (
          <div className="mt-10 max-w-3xl">
            <h2 className="font-display text-3xl font-semibold">{loaded.dict.legal.deletionTitle}</h2>
            <p className="mt-2 mb-5 text-slate">{loaded.dict.legal.deletionIntro}</p>
            <ContactForm
              locale={loaded.locale}
              copy={loaded.dict.contact}
              categories={[{ value: "data_deletion", label: loaded.dict.legal.deletionTitle }, ...loaded.dict.contact.categories]}
              presetCategory="data_deletion"
              presetMessage={loaded.dict.deletion.reason}
            />
          </div>
        ) : null}
      </Container>
    </>
  );
}
