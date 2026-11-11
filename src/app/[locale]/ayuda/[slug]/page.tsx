import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loaded = await loadPublic(locale);
  if (!loaded) return {};
  const article = await prisma.helpArticle.findUnique({ where: { locale_slug: { locale: loaded.locale, slug } } }).catch(() => null);
  if (!article) return {};
  return pageMetadata(loaded.locale, `/ayuda/${slug}`, article.title, article.summary);
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeRaw, slug } = await params;
  const loaded = await loadPublic(localeRaw);
  if (!loaded) notFound();
  const article = await prisma.helpArticle.findUnique({ where: { locale_slug: { locale: loaded.locale, slug } } }).catch(() => null);
  if (!article || !article.published) notFound();
  return (
    <>
      <PageHero kicker={loaded.dict.help.kicker} title={article.title} description={article.summary} />
      <Container className="py-14">
        <article className="max-w-3xl whitespace-pre-line rounded-3xl bg-white p-6 text-base leading-relaxed ring-1 ring-line md:p-8">
          {article.body}
        </article>
        <Link className="mt-6 inline-flex font-semibold text-blue-700" href={localize(loaded.locale, "/ayuda")}>{loaded.dict.help.back}</Link>
      </Container>
    </>
  );
}
