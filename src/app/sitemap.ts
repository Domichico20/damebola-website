import type { MetadataRoute } from "next";
import { publicPaths, siteUrl } from "@/lib/routes";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const articles = await prisma.helpArticle.findMany({ where: { published: true }, select: { locale: true, slug: true, updatedAt: true } }).catch(() => []);
  const now = new Date();
  const pages = publicPaths.flatMap((path) => {
    const es = path === "/" ? `${base}/` : `${base}${path}`;
    const en = path === "/" ? `${base}/en` : `${base}/en${path}`;
    return [
      { url: es, lastModified: now, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7, alternates: { languages: { es, en } } },
      { url: en, lastModified: now, changeFrequency: "weekly" as const, priority: path === "/" ? 0.9 : 0.6, alternates: { languages: { es, en } } },
    ];
  });
  const extra = articles.map((article) => {
    const path = article.locale === "en" ? `${base}/en/ayuda/${article.slug}` : `${base}/ayuda/${article.slug}`;
    return { url: path, lastModified: article.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 };
  });
  return [...pages, ...extra];
}
