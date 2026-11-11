import { createHash } from "crypto";
import { headers } from "next/headers";

export async function clientIpHash() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  const salt = process.env.IP_HASH_SALT || "damebola-dev";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}
