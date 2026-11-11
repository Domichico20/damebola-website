import { prisma } from "./db";

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  await prisma.rateBucket.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
  const count = await prisma.rateBucket.count({ where: { key, createdAt: { gte: since } } });
  if (count >= limit) return false;
  await prisma.rateBucket.create({ data: { key } });
  return true;
}
