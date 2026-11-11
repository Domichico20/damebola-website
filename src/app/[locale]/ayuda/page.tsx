import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpCenter } from "@/components/HelpCenter";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/ayuda", loaded.dict.help.title, loaded.dict.help.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale } = loaded;
  const [faqs, articles] = await Promise.all([
    prisma.faqItem.findMany({ where: { locale, published: true }, orderBy: [{ audience: "asc" }, { sortOrder: "asc" }] }).catch(() => []),
    prisma.helpArticle.findMany({ where: { locale, published: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);
  return (
    <>
      <PageHero kicker={dict.help.kicker} title={dict.help.title} description={dict.help.description} />
      <Container className="py-14">
        <HelpCenter
          locale={locale}
          copy={dict.help}
          faqs={faqs.map((item) => ({ audience: item.audience, question: item.question, answer: item.answer }))}
          articles={articles.map((item) => ({ audience: item.audience, slug: item.slug, title: item.title, summary: item.summary }))}
        />
        <div className="mt-10 rounded-3xl bg-navy-950 p-6 text-white">
          <h2 className="font-display text-2xl font-semibold">{dict.help.more}</h2>
          <Link className="mt-3 inline-flex font-semibold text-cyan-300" href={localize(locale, "/contacto")}>{dict.help.contact}</Link>
        </div>
      </Container>
    </>
  );
}
