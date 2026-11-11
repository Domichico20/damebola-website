import { prisma } from "./db";

export const settingDefaults = {
  supportEmail: "Info@DameBolaApp.com",
  whatsappNumber: "",
  socialInstagram: "",
  socialFacebook: "",
  socialX: "",
  socialTiktok: "",
  socialYoutube: "",
  appStorePassenger: "",
  playStorePassenger: "",
  appStoreDriver: "",
  playStoreDriver: "",
  gaMeasurementId: "",
  announcementEnabled: "true",
  promotionEnabled: "true",
  legalName: "DAMEBOLA LLC",
  companyAddress: "",
} as const;

export type SettingKey = keyof typeof settingDefaults;

export async function getSettings() {
  const merged: Record<SettingKey, string> = { ...settingDefaults };
  try {
    const rows = await prisma.siteSetting.findMany();
    for (const row of rows) {
      if (row.key in merged) merged[row.key as SettingKey] = row.value;
    }
  } catch (error) {
    console.error("settings load failed", error);
  }
  return merged;
}

export async function getContentMap(locale: string) {
  try {
    const rows = await prisma.contentBlock.findMany({ where: { locale } });
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch (error) {
    console.error("content load failed", error);
    return {} as Record<string, string>;
  }
}

export function pick(map: Record<string, string>, key: string, fallback: string) {
  const value = map[key]?.trim();
  return value ? value : fallback;
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function whatsappLink(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return "";
  const text = encodeURIComponent("Hola, DameBola. Quiero información.");
  return `https://wa.me/${digits}?text=${text}`;
}
