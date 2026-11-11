import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/baja", "/en/baja"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
