"use server";

import { randomBytes } from "crypto";
import { getDictionary } from "@/content";
import { prisma } from "@/lib/db";
import { applicationReceivedEmail, contactReceivedEmail, notifyAdmin, sendMail, signupAdminEmail, subscriberEmail, escapeHtml, layout } from "@/lib/email";
import { detectMime, MAX_FILE_BYTES, removePrivateFile, savePrivateFile, safeOriginalName } from "@/lib/files";
import { clientIpHash, sha256 } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/routes";
import { contactSchema, driverSchema, newsletterSchema } from "@/lib/validators";
import type { PublicState } from "@/lib/form-state";

function localeOf(formData: FormData) {
  return formData.get("locale") === "en" ? "en" : "es";
}

function tooFast(formData: FormData) {
  const started = Number(formData.get("startedAt"));
  if (!Number.isFinite(started)) return true;
  const delta = Date.now() - started;
  return delta < 700 || delta > 1000 * 60 * 60 * 24;
}

function messageFor(key: string, dict: ReturnType<typeof getDictionary>) {
  const errors = dict.forms.errors;
  if (key === "email") return errors.email;
  if (key === "phone" || key === "whatsapp") return errors.phone;
  if (key === "province") return errors.province;
  if (key === "vehicleYear") return errors.year;
  if (key === "message") return errors.short;
  if (key === "consent") return errors.consent;
  if (key === "meetsRequirements") return errors.requirements;
  if (key === "privacyConsent") return errors.privacy;
  if (key === "interest") return errors.interest;
  return errors.required;
}

async function guard(formData: FormData, bucket: string) {
  const dict = getDictionary(localeOf(formData));
  if (String(formData.get("website") || "").trim()) return { dict, quiet: true as const };
  if (tooFast(formData)) return { dict, error: dict.forms.errors.generic };
  const ipHash = await clientIpHash();
  const allowed = await rateLimit(`${bucket}:${ipHash}`, 6, 60 * 60 * 1000);
  if (!allowed) return { dict, error: dict.forms.errors.rate };
  return { dict, ipHash };
}

export async function submitDriver(_prev: PublicState, formData: FormData): Promise<PublicState> {
  const gate = await guard(formData, "driver");
  if ("quiet" in gate && gate.quiet) return { ok: true, message: getDictionary(localeOf(formData)).drive.successBody, fieldErrors: {} };
  if ("error" in gate && gate.error) return { ok: false, message: gate.error, fieldErrors: {} };
  const dict = gate.dict;
  const parsed = driverSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp") || "",
    email: formData.get("email"),
    city: formData.get("city"),
    province: formData.get("province"),
    vehicleType: formData.get("vehicleType"),
    vehicleMake: formData.get("vehicleMake"),
    vehicleModel: formData.get("vehicleModel"),
    vehicleYear: formData.get("vehicleYear"),
    licenseNumber: formData.get("licenseNumber"),
    licenseExpiry: formData.get("licenseExpiry") || "",
    meetsRequirements: formData.get("meetsRequirements"),
    privacyConsent: formData.get("privacyConsent"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = messageFor(key, dict);
    }
    return { ok: false, message: dict.forms.errors.required, fieldErrors };
  }

  const kinds = [
    ["licenseFile", "license"],
    ["registrationFile", "registration"],
    ["insuranceFile", "insurance"],
    ["otherFile", "other"],
  ] as const;
  const uploads: Array<{ kind: string; originalName: string; storedName: string; mimeType: string; size: number }> = [];
  const fieldErrors: Record<string, string> = {};
  for (const [field, kind] of kinds) {
    const file = formData.get(field);
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_FILE_BYTES) fieldErrors[field] = dict.forms.errors.fileSize;
    else {
      const bytes = Buffer.from(await file.arrayBuffer());
      const mime = detectMime(bytes);
      if (!mime) fieldErrors[field] = dict.forms.errors.fileType;
      else {
        const storedName = await savePrivateFile(bytes, mime);
        uploads.push({ kind, originalName: safeOriginalName(file.name), storedName, mimeType: mime, size: bytes.length });
      }
    }
  }
  if (Object.keys(fieldErrors).length) {
    await Promise.all(uploads.map((file) => removePrivateFile(file.storedName)));
    return { ok: false, message: dict.forms.errors.fileType, fieldErrors };
  }

  try {
    const created = await prisma.driverApplication.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp || null,
        email: parsed.data.email,
        city: parsed.data.city,
        province: parsed.data.province,
        vehicleType: parsed.data.vehicleType,
        vehicleMake: parsed.data.vehicleMake,
        vehicleModel: parsed.data.vehicleModel,
        vehicleYear: parsed.data.vehicleYear,
        licenseNumber: parsed.data.licenseNumber,
        licenseExpiry: parsed.data.licenseExpiry || null,
        meetsRequirements: true,
        privacyConsent: true,
        locale: localeOf(formData),
        ipHash: gate.ipHash,
        documents: uploads.length ? { create: uploads } : undefined,
      },
    });
    const reference = created.id.slice(-8).toUpperCase();
    const mail = applicationReceivedEmail(created.locale, created.firstName, reference);
    const emailStatus = await sendMail({ to: created.email, ...mail });
    const adminLines = [
      `Referencia: ${reference}`,
      `Nombre: ${created.firstName} ${created.lastName}`,
      `Correo: ${created.email}`,
      `Teléfono: ${created.phone}`,
      `WhatsApp: ${created.whatsapp || "—"}`,
      `Ciudad: ${created.city}, ${created.province}`,
      `Vehículo: ${created.vehicleType} · ${created.vehicleMake} ${created.vehicleModel} ${created.vehicleYear}`,
      `Licencia: ${created.licenseNumber}${created.licenseExpiry ? ` · vence ${created.licenseExpiry}` : ""}`,
    ];
    const adminStatus = await notifyAdmin(
      `Nueva preinscripción ${reference}`,
      adminLines.join("\n"),
      layout("Nueva preinscripción", `<p>${adminLines.map((line) => escapeHtml(line)).join("<br>")}</p>`),
    );
    await prisma.driverApplication.update({
      where: { id: created.id },
      data: { emailStatus, adminEmailStatus: adminStatus },
    });
    const extra = emailStatus === "sent"
      ? created.locale === "en" ? " We also emailed you a confirmation." : " También te enviamos un correo de confirmación."
      : "";
    return { ok: true, message: dict.drive.successBody + extra, fieldErrors: {}, reference };
  } catch (error) {
    console.error(error);
    await Promise.all(uploads.map((file) => removePrivateFile(file.storedName)));
    return { ok: false, message: dict.forms.errors.generic, fieldErrors: {} };
  }
}

export async function submitContact(_prev: PublicState, formData: FormData): Promise<PublicState> {
  const gate = await guard(formData, "contact");
  if ("quiet" in gate && gate.quiet) return { ok: true, message: getDictionary(localeOf(formData)).contact.successSaved, fieldErrors: {} };
  if ("error" in gate && gate.error) return { ok: false, message: gate.error, fieldErrors: {} };
  const dict = gate.dict;
  const parsed = contactSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    category: formData.get("category"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = messageFor(key, dict);
    }
    return { ok: false, message: dict.forms.errors.required, fieldErrors };
  }
  if (parsed.data.phone && (parsed.data.phone.match(/\d/g) || []).length < 8) {
    return { ok: false, message: dict.forms.errors.phone, fieldErrors: { phone: dict.forms.errors.phone } };
  }
  try {
    const created = await prisma.contactInquiry.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        category: parsed.data.category,
        message: parsed.data.message,
        locale: localeOf(formData),
        ipHash: gate.ipHash,
      },
    });
    const mail = contactReceivedEmail(created.locale, created.fullName);
    const emailStatus = await sendMail({ to: created.email, ...mail });
    await notifyAdmin(
      `Mensaje DameBola · ${created.category}`,
      `${created.fullName} <${created.email}>\n${created.message}`,
      layout("Nuevo mensaje", `<p>${escapeHtml(created.fullName)} · ${escapeHtml(created.email)}</p><p>${escapeHtml(created.category)}</p><p>${escapeHtml(created.message)}</p>`),
    );
    await prisma.contactInquiry.update({ where: { id: created.id }, data: { emailStatus } });
    const message = emailStatus === "sent" ? `${dict.contact.successSent} ${created.email}.` : `${dict.contact.successSaved} ${created.email}.`;
    return { ok: true, message, fieldErrors: {} };
  } catch (error) {
    console.error(error);
    return { ok: false, message: dict.forms.errors.generic, fieldErrors: {} };
  }
}

export async function submitNewsletter(_prev: PublicState, formData: FormData): Promise<PublicState> {
  const gate = await guard(formData, "newsletter");
  if ("quiet" in gate && gate.quiet) return { ok: true, message: getDictionary(localeOf(formData)).forms.subscribed, fieldErrors: {} };
  if ("error" in gate && gate.error) return { ok: false, message: gate.error, fieldErrors: {} };
  const dict = gate.dict;
  const parsed = newsletterSchema.safeParse({
    name: formData.get("name") || "",
    email: formData.get("email"),
    city: formData.get("city") || "",
    whatsapp: formData.get("whatsapp") || "",
    interest: formData.get("interest"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = messageFor(key, dict);
    }
    return { ok: false, message: dict.forms.errors.required, fieldErrors };
  }
  const locale = localeOf(formData);
  const rawToken = randomBytes(32).toString("base64url");
  const unsubTokenHash = sha256(rawToken);
  const path = locale === "en" ? `/en/baja/${rawToken}` : `/baja/${rawToken}`;
  const unsubscribeUrl = `${siteUrl()}${path}`;
  try {
    const existing = await prisma.subscriber.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (existing && !existing.unsubscribedAt) {
      return { ok: true, message: dict.forms.already, fieldErrors: {} };
    }
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name || null,
        whatsapp: parsed.data.whatsapp,
        city: parsed.data.city || null,
        interest: parsed.data.interest,
        consent: true,
        locale,
        unsubTokenHash,
      },
      update: {
        name: parsed.data.name || null,
        whatsapp: parsed.data.whatsapp,
        city: parsed.data.city || null,
        interest: parsed.data.interest,
        consent: true,
        locale,
        unsubTokenHash,
        unsubscribedAt: null,
      },
    });
    const notice = signupAdminEmail({
      name: parsed.data.name || "",
      email: parsed.data.email.toLowerCase(),
      whatsapp: parsed.data.whatsapp,
      city: parsed.data.city || "",
      interest: parsed.data.interest,
      locale,
    });
    await notifyAdmin(notice.subject, notice.text, notice.html);
    const mail = subscriberEmail(locale, unsubscribeUrl);
    await sendMail({ to: parsed.data.email, ...mail });
    if (process.env.EMAIL_MARKETING_WEBHOOK) {
      await fetch(process.env.EMAIL_MARKETING_WEBHOOK, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.EMAIL_MARKETING_TOKEN ? { authorization: `Bearer ${process.env.EMAIL_MARKETING_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          email: parsed.data.email.toLowerCase(),
          name: parsed.data.name || null,
          whatsapp: parsed.data.whatsapp,
          city: parsed.data.city || null,
          interest: parsed.data.interest,
          locale,
        }),
      }).catch((error) => console.error("marketing webhook failed", error));
    }
    return { ok: true, message: dict.forms.subscribed, fieldErrors: {} };
  } catch (error) {
    console.error(error);
    return { ok: false, message: dict.forms.errors.generic, fieldErrors: {} };
  }
}

export async function confirmUnsubscribe(_prev: PublicState, formData: FormData): Promise<PublicState> {
  const dict = getDictionary(localeOf(formData));
  const token = String(formData.get("token") || "");
  const subscriber = await prisma.subscriber.findUnique({ where: { unsubTokenHash: sha256(token) } });
  if (!subscriber) return { ok: false, message: dict.forms.unsubMissing, fieldErrors: {} };
  if (!subscriber.unsubscribedAt) {
    await prisma.subscriber.update({ where: { id: subscriber.id }, data: { unsubscribedAt: new Date() } });
  }
  return { ok: true, message: dict.forms.unsubscribed, fieldErrors: {} };
}
