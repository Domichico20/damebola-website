import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clientIpHash } from "@/lib/request";

export async function POST(request: Request) {
  const ipHash = await clientIpHash();
  const allowed = await rateLimit(`track:${ipHash}`, 80, 60 * 60 * 1000).catch(() => false);
  if (!allowed) return new Response(null, { status: 204 });
  const body = await request.json().catch(() => null);
  const raw = typeof body?.path === "string" ? body.path : "";
  if (!raw.startsWith("/") || raw.includes("..") || raw.startsWith("/admin") || raw.startsWith("/api") || raw.startsWith("/baja")) {
    return new Response(null, { status: 204 });
  }
  const locale = raw === "/en" || raw.startsWith("/en/") ? "en" : "es";
  const path = (locale === "en" ? raw.replace(/^\/en/, "") || "/" : raw).slice(0, 180);
  const day = new Date().toISOString().slice(0, 10);
  await prisma.pageViewDaily.upsert({
    where: { day_path_locale: { day, path, locale } },
    create: { day, path, locale, count: 1 },
    update: { count: { increment: 1 } },
  }).catch(() => undefined);
  return new Response(null, { status: 204 });
}
