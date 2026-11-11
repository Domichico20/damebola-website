"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { Secret, TOTP } from "otpauth";
import { redirect } from "next/navigation";
import { adminCopy } from "@/content/admin-ui";
import { prisma } from "@/lib/db";
import { clearSessionCookie, getSession, safeNextPath, setSessionCookie, signSession } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { writeAudit } from "@/lib/audit";
import { escapeHtml, layout, sendMail, smtpConfigured } from "@/lib/email";
import { clientIpHash, sha256 } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/routes";
import { applicationStatuses, inquiryStatuses, roles, type Role } from "@/lib/validators";

export type AuthState = { message: string; totpRequired?: boolean; codes?: string[]; password?: string };

async function actor(allowed?: Role[]) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (allowed && !allowed.includes(session.role)) redirect("/admin?aviso=permiso");
  return session;
}

async function flash<K extends keyof ReturnType<typeof adminCopy>["flash"]>(key: K) {
  return adminCopy(await getAdminLocale()).flash[key];
}

function strong(password: string) {
  return password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const code = String(formData.get("code") || "").replace(/\s/g, "");
  const ipHash = await clientIpHash();
  const allowed = await rateLimit(`login:${ipHash}:${email}`, 8, 15 * 60 * 1000);
  if (!allowed) return { message: await flash("tooMany") };
  const user = await prisma.adminUser.findUnique({ where: { email } });
  const valid = user && user.active && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !valid) return { message: await flash("badLogin") };
  if (user.totpEnabled) {
    if (!code) return { totpRequired: true, message: await flash("needCode") };
    const totp = new TOTP({ secret: Secret.fromBase32(user.totpSecret || ""), algorithm: "SHA1", digits: 6, period: 30 });
    const totpOk = totp.validate({ token: code, window: 1 }) !== null;
    const recovery = await prisma.recoveryCode.findMany({ where: { userId: user.id, usedAt: null } });
    const match = recovery.find((item) => item.codeHash === sha256(code.toUpperCase()));
    if (!totpOk && !match) return { totpRequired: true, message: await flash("badCode") };
    if (match) await prisma.recoveryCode.update({ where: { id: match.id }, data: { usedAt: new Date() } });
  }
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await setSessionCookie(await signSession(user));
  await writeAudit({ actorId: user.id, action: "login" });
  redirect(safeNextPath(String(formData.get("next") || "")));
}

export async function logoutAction() {
  const session = await getSession();
  if (session) await writeAudit({ actorId: session.id, action: "logout" });
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function requestReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const locale = await getAdminLocale();
  const generic = adminCopy(locale).flash.resetGeneric;
  if (!smtpConfigured()) return { message: adminCopy(locale).flash.resetUnavailable };
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (user && user.active) {
    const raw = randomBytes(32).toString("base64url");
    await prisma.passwordReset.create({
      data: { userId: user.id, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + 30 * 60 * 1000) },
    });
    const url = `${siteUrl()}/admin/restablecer/${raw}`;
    const subject = locale === "en" ? "Reset your DameBola access" : "Restablecer acceso a DameBola";
    const body = locale === "en" ? "Use this link within the next 30 minutes." : "Usa este enlace en los próximos 30 minutos.";
    await sendMail({
      to: user.email,
      subject,
      text: `${body} ${url}`,
      html: layout(subject, `<p>${body}</p><p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`),
    });
    await writeAudit({ actorId: user.id, action: "password_reset_request" });
  }
  return { message: generic };
}

export async function resetPassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (password !== confirm) return { message: await flash("mismatch") };
  if (!strong(password)) return { message: await flash("weak") };
  const row = await prisma.passwordReset.findUnique({ where: { tokenHash: sha256(token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) return { message: await flash("badLink") };
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.update({
    where: { id: row.userId },
    data: { passwordHash, sessionVersion: { increment: 1 }, mustChangePassword: false },
  });
  await prisma.passwordReset.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  await writeAudit({ actorId: user.id, action: "password_reset" });
  redirect("/admin/login?aviso=clave");
}

export async function changePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const current = String(formData.get("current") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { message: await flash("badCurrent") };
  if (password !== confirm || !strong(password)) return { message: await flash("weakMatch") };
  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 12), sessionVersion: { increment: 1 }, mustChangePassword: false },
  });
  await setSessionCookie(await signSession(updated));
  await writeAudit({ actorId: user.id, action: "password_change" });
  return { message: await flash("passwordUpdated") };
}

export async function beginTotp() {
  const session = await actor();
  const secret = new Secret({ size: 20 });
  await prisma.adminUser.update({ where: { id: session.id }, data: { totpSecret: secret.base32, totpEnabled: false } });
  await writeAudit({ actorId: session.id, action: "totp_begin" });
}

export async function confirmTotp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await actor();
  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user?.totpSecret) return { message: await flash("needQr") };
  const totp = new TOTP({ issuer: "DameBola", label: user.email, secret: Secret.fromBase32(user.totpSecret), algorithm: "SHA1", digits: 6, period: 30 });
  const code = String(formData.get("code") || "").replace(/\s/g, "");
  if (totp.validate({ token: code, window: 1 }) === null) return { message: await flash("codeMismatch") };
  const codes = Array.from({ length: 8 }, () => `${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}`.toUpperCase());
  await prisma.recoveryCode.deleteMany({ where: { userId: user.id } });
  await prisma.recoveryCode.createMany({ data: codes.map((value) => ({ userId: user.id, codeHash: sha256(value) })) });
  await prisma.adminUser.update({ where: { id: user.id }, data: { totpEnabled: true } });
  await writeAudit({ actorId: user.id, action: "totp_enable" });
  return { message: await flash("totpOn"), codes };
}

export async function disableOwnTotp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await actor();
  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user || !(await bcrypt.compare(String(formData.get("password") || ""), user.passwordHash))) return { message: await flash("badPassword") };
  await prisma.adminUser.update({ where: { id: user.id }, data: { totpEnabled: false, totpSecret: null } });
  await prisma.recoveryCode.deleteMany({ where: { userId: user.id } });
  await writeAudit({ actorId: user.id, action: "totp_disable" });
  return { message: await flash("totpOff") };
}

export async function createStaff(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await actor(["owner"]);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "");
  if (name.length < 2 || !email.includes("@") || !roles.includes(role as Role) || role === "owner") {
    return { message: await flash("staffCheck") };
  }
  const password = randomBytes(9).toString("base64url");
  try {
    const user = await prisma.adminUser.create({
      data: { name, email, role, passwordHash: await bcrypt.hash(password, 12), mustChangePassword: true },
    });
    await writeAudit({ actorId: session.id, action: "staff_create", entityType: "admin", entityId: user.id });
    return { message: (await flash("staffCreated")).replace("{email}", email), password };
  } catch {
    return { message: await flash("staffFailed") };
  }
}

export async function setStaffActive(formData: FormData) {
  const session = await actor(["owner"]);
  const id = String(formData.get("id") || "");
  const active = formData.get("active") === "true";
  if (id === session.id) redirect("/admin/equipo?aviso=propia");
  await prisma.adminUser.update({ where: { id }, data: { active, sessionVersion: { increment: 1 } } });
  await writeAudit({ actorId: session.id, action: active ? "staff_enable" : "staff_disable", entityId: id });
  redirect("/admin/equipo");
}

export async function disableStaffTotp(formData: FormData) {
  const session = await actor(["owner"]);
  const id = String(formData.get("id") || "");
  await prisma.adminUser.update({ where: { id }, data: { totpEnabled: false, totpSecret: null } });
  await prisma.recoveryCode.deleteMany({ where: { userId: id } });
  await writeAudit({ actorId: session.id, action: "staff_totp_reset", entityId: id });
  redirect("/admin/equipo");
}

export async function updateApplication(formData: FormData) {
  const session = await actor(["owner", "admin", "support"]);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "").trim();
  const applicantMessage = String(formData.get("applicantMessage") || "").trim();
  const notify = formData.get("notify") === "on";
  if (!applicationStatuses.includes(status as (typeof applicationStatuses)[number])) redirect(`/admin/solicitudes/${id}`);
  const application = await prisma.driverApplication.update({ where: { id }, data: { status } });
  if (note) {
    await prisma.applicationNote.create({ data: { applicationId: id, authorId: session.id, body: note, sentToUser: false } });
  }
  let sent = false;
  if (notify) {
    const text = applicantMessage || defaultApplicantMessage(application.locale, status, application.id.slice(-8).toUpperCase());
    const result = await sendMail({
      to: application.email,
      subject: application.locale === "en" ? "Update on your DameBola pre-registration" : "Actualización de tu preinscripción DameBola",
      text,
      html: layout(application.locale === "en" ? "Pre-registration update" : "Actualización de preinscripción", `<p>${escapeHtml(text)}</p>`),
    });
    sent = result === "sent";
    await prisma.applicationNote.create({ data: { applicationId: id, authorId: session.id, body: text, sentToUser: sent } });
  }
  await writeAudit({ actorId: session.id, action: "application_status", entityType: "application", entityId: id, metadata: { status, sent } });
  redirect(`/admin/solicitudes/${id}?aviso=guardado`);
}

function defaultApplicantMessage(locale: string, status: string, reference: string) {
  if (locale === "en") {
    if (status === "approved") return `Your DameBola pre-registration ${reference} was marked approved. This does not activate a driver account in the app. We will write when the next step is available.`;
    if (status === "rejected") return `Your DameBola pre-registration ${reference} was not approved. You can contact Info@DameBolaApp.com if you have a question.`;
    if (status === "more_info") return `We need more information to continue reviewing DameBola pre-registration ${reference}. Reply to this email or use the contact form.`;
    return `The status of DameBola pre-registration ${reference} is now ${status}. This is not an automatic approval.`;
  }
  if (status === "approved") return `Tu preinscripción ${reference} fue marcada como aprobada. Eso no activa todavía una cuenta de conductor en la aplicación. Te escribiremos cuando el siguiente paso esté disponible.`;
  if (status === "rejected") return `Tu preinscripción ${reference} no fue aprobada. Puedes escribir a Info@DameBolaApp.com si tienes una pregunta.`;
  if (status === "more_info") return `Necesitamos más información para seguir con la preinscripción ${reference}. Responde a este correo o usa el formulario de contacto.`;
  return `El estado de tu preinscripción ${reference} cambió. Esto no es una aprobación automática.`;
}

export async function updateInquiry(formData: FormData) {
  const session = await actor(["owner", "admin", "support"]);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "").trim();
  const send = formData.get("send") === "on";
  if (!inquiryStatuses.includes(status as (typeof inquiryStatuses)[number])) redirect(`/admin/mensajes/${id}`);
  const inquiry = await prisma.contactInquiry.update({ where: { id }, data: { status } });
  if (note) {
    let sent = false;
    if (send) {
      const result = await sendMail({
        to: inquiry.email,
        subject: "DameBola",
        text: note,
        html: layout("DameBola", `<p>${escapeHtml(note).replaceAll("\n", "<br>")}</p>`),
      });
      sent = result === "sent";
    }
    await prisma.inquiryNote.create({ data: { inquiryId: id, authorId: session.id, body: note, sentToUser: sent } });
  }
  await writeAudit({ actorId: session.id, action: "inquiry_update", entityId: id, metadata: { status } });
  redirect(`/admin/mensajes/${id}?aviso=guardado`);
}

export async function deleteInquiry(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!inquiry) redirect("/admin/mensajes");
  await prisma.contactInquiry.delete({ where: { id } });
  await writeAudit({ actorId: session.id, action: "inquiry_delete", entityType: "inquiry", entityId: id });
  redirect("/admin/mensajes");
}

const contentKeys = [
  "hero_title", "hero_accent", "hero_description", "announcement", "promotion_kicker", "promotion_title",
  "promotion_body", "promotion_href", "early_title", "early_description", "about_lead", "driver_requirements",
  "pricing_note", "payment_note", "cancellation_note",
];

export async function saveContent(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const locale = formData.get("locale") === "en" ? "en" : "es";
  for (const key of contentKeys) {
    const value = String(formData.get(key) || "");
    if (!value.trim()) {
      await prisma.contentBlock.deleteMany({ where: { key, locale } });
    } else {
      await prisma.contentBlock.upsert({
        where: { key_locale: { key, locale } },
        create: { key, locale, value },
        update: { value },
      });
    }
  }
  await prisma.siteSetting.upsert({
    where: { key: "announcementEnabled" },
    create: { key: "announcementEnabled", value: formData.get("announcementEnabled") === "on" ? "true" : "false" },
    update: { value: formData.get("announcementEnabled") === "on" ? "true" : "false" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "promotionEnabled" },
    create: { key: "promotionEnabled", value: formData.get("promotionEnabled") === "on" ? "true" : "false" },
    update: { value: formData.get("promotionEnabled") === "on" ? "true" : "false" },
  });
  await writeAudit({ actorId: session.id, action: "content_update", metadata: { locale } });
  redirect(`/admin/contenido?locale=${locale}&aviso=guardado`);
}

export async function saveSettings(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const keys = [
    "supportEmail", "whatsappNumber", "socialInstagram", "socialFacebook", "socialX", "socialTiktok", "socialYoutube",
    "appStorePassenger", "playStorePassenger", "appStoreDriver", "playStoreDriver", "gaMeasurementId", "legalName", "companyAddress",
  ];
  for (const key of keys) {
    const value = String(formData.get(key) || "").trim();
    if (key.startsWith("social") || key.startsWith("app") || key.startsWith("play")) {
      if (value && !/^https?:\/\//.test(value)) continue;
    }
    if (key === "gaMeasurementId" && value && !/^G-[A-Z0-9]+$/i.test(value)) continue;
    await prisma.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
  }
  await writeAudit({ actorId: session.id, action: "settings_update" });
  redirect("/admin/ajustes?aviso=guardado");
}

export async function saveFaq(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  const data = {
    locale: formData.get("locale") === "en" ? "en" : "es",
    audience: formData.get("audience") === "driver" ? "driver" : "passenger",
    question: String(formData.get("question") || "").trim(),
    answer: String(formData.get("answer") || "").trim(),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (data.question.length < 4 || data.answer.length < 4) redirect("/admin/ayuda?aviso=incompleto");
  if (id) await prisma.faqItem.update({ where: { id }, data });
  else await prisma.faqItem.create({ data });
  await writeAudit({ actorId: session.id, action: "faq_save", entityId: id || "new" });
  redirect("/admin/ayuda?aviso=guardado");
}

export async function deleteFaq(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  await prisma.faqItem.delete({ where: { id } });
  await writeAudit({ actorId: session.id, action: "faq_delete", entityId: id });
  redirect("/admin/ayuda");
}

export async function saveArticle(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const data = {
    locale: formData.get("locale") === "en" ? "en" : "es",
    audience: ["passenger", "driver", "all"].includes(String(formData.get("audience"))) ? String(formData.get("audience")) : "all",
    slug,
    title: String(formData.get("title") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (!slug || data.title.length < 4 || data.body.length < 10) redirect("/admin/ayuda?aviso=incompleto");
  if (id) await prisma.helpArticle.update({ where: { id }, data });
  else await prisma.helpArticle.create({ data });
  await writeAudit({ actorId: session.id, action: "article_save", entityId: id || slug });
  redirect("/admin/ayuda?aviso=guardado");
}

export async function deleteArticle(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  await prisma.helpArticle.delete({ where: { id } });
  await writeAudit({ actorId: session.id, action: "article_delete", entityId: id });
  redirect("/admin/ayuda");
}

export async function saveSafety(formData: FormData) {
  const session = await actor(["owner", "admin"]);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!["live", "soon", "partial"].includes(status)) redirect("/admin/funciones");
  await prisma.safetyFeature.update({
    where: { id },
    data: {
      status,
      titleEs: String(formData.get("titleEs") || ""),
      bodyEs: String(formData.get("bodyEs") || ""),
      titleEn: String(formData.get("titleEn") || ""),
      bodyEn: String(formData.get("bodyEn") || ""),
    },
  });
  await writeAudit({ actorId: session.id, action: "safety_update", entityId: id, metadata: { status } });
  redirect("/admin/funciones?aviso=guardado");
}
