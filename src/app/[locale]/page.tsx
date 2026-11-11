import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { loadPublic } from "@/components/site/Shell";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/db";
import type { SafetyStatus } from "@/content/safety";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/", loaded.dict.meta.title, loaded.dict.meta.description);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const features = await prisma.safetyFeature.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  const safety = features.map((feature) => ({
    id: feature.id,
    status: feature.status as SafetyStatus,
    title: loaded.locale === "en" ? feature.titleEn : feature.titleEs,
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(loaded.settings.supportEmail)).replace(/</g, "\\u003c") }} />
      <HomePage
        locale={loaded.locale}
        dict={loaded.dict}
        content={loaded.content}
        promotionEnabled={loaded.settings.promotionEnabled === "true"}
        safety={safety}
      />
    </>
  );
}
