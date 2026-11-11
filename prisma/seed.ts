import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { articleSeed } from "../src/content/articles";
import { faqSeed } from "../src/content/faqs";
import { safetySeed } from "../src/content/safety";

const prisma = new PrismaClient();

const settings: Record<string, string> = {
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
  legalName: "DameBola",
  companyAddress: "",
};

async function main() {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  for (const feature of safetySeed) {
    await prisma.safetyFeature.upsert({
      where: { id: feature.id },
      update: {},
      create: feature,
    });
  }
  if ((await prisma.faqItem.count()) === 0) {
    await prisma.faqItem.createMany({ data: faqSeed });
  }
  if ((await prisma.helpArticle.count()) === 0) {
    await prisma.helpArticle.createMany({ data: articleSeed });
  }
  const email = (process.env.ADMIN_EMAIL || "Info@DameBolaApp.com").toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 12) {
      throw new Error("Set ADMIN_PASSWORD in .env before seeding the first administrator.");
    }
    await prisma.adminUser.create({
      data: {
        email,
        name: process.env.ADMIN_NAME || "Administrador",
        passwordHash: await bcrypt.hash(password, 12),
        role: "owner",
      },
    });
    console.log(`Created owner ${email}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
