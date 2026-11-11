import nodemailer from "nodemailer";
import { getSettings } from "./settings";

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function transport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || "" }
      : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#0c1730">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#071227;color:#fff;border-radius:20px 20px 0 0;padding:22px 28px;font-size:22px;font-weight:700">DameBola</div>
    <div style="background:#fff;border-radius:0 0 20px 20px;padding:28px;line-height:1.55">
      <h1 style="font-size:22px;margin:0 0 12px">${title}</h1>
      ${body}
      <p style="color:#3e5068;font-size:13px;margin-top:28px">DameBola · www.DameBolaApp.com</p>
    </div>
  </div></body></html>`;
}

export async function sendMail(input: { to: string; subject: string; text: string; html: string }) {
  if (!smtpConfigured()) return "not_configured" as const;
  try {
    await Promise.race([
      transport().sendMail({
        from: process.env.SMTP_FROM,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("email timeout")), 12000)),
    ]);
    return "sent" as const;
  } catch (error) {
    console.error("email failed", error);
    return "failed" as const;
  }
}

export async function notifyAdmin(subject: string, text: string, html: string) {
  const settings = await getSettings();
  const to = process.env.NOTIFY_EMAIL || settings.supportEmail;
  return sendMail({ to, subject, text, html });
}

export function applicationReceivedEmail(locale: string, name: string, reference: string) {
  if (locale === "en") {
    const text = `Hello ${name},\n\nWe received your DameBola driver pre-registration. Reference: ${reference}.\n\nA person on our team will review it. Submitting this form does not approve your driver account and does not guarantee trips or earnings.\n\nDameBola`;
    return {
      subject: "We received your DameBola pre-registration",
      text,
      html: layout("Pre-registration received", `<p>Hello ${escapeHtml(name)},</p><p>We received your driver pre-registration.</p><p><strong>Reference:</strong> ${escapeHtml(reference)}</p><p>A person on our team will review it. This form does not approve your driver account and does not guarantee trips or earnings.</p>`),
    };
  }
  const text = `Hola ${name},\n\nRecibimos tu preinscripción de conductor en DameBola. Referencia: ${reference}.\n\nUna persona del equipo la revisará. Enviar este formulario no aprueba tu cuenta de conductor y no garantiza viajes ni ingresos.\n\nDameBola`;
  return {
    subject: "Recibimos tu preinscripción en DameBola",
    text,
    html: layout(
      "Preinscripción recibida",
      `<p>Hola ${escapeHtml(name)},</p><p>Recibimos tu preinscripción de conductor.</p><p><strong>Referencia:</strong> ${escapeHtml(reference)}</p><p>Una persona del equipo la revisará. Enviar este formulario no aprueba tu cuenta de conductor y no garantiza viajes ni ingresos.</p>`,
    ),
  };
}

export function contactReceivedEmail(locale: string, name: string) {
  if (locale === "en") {
    return {
      subject: "We received your message — DameBola",
      text: `Hello ${name},\n\nWe received your message and the DameBola team can review it. If email delivery is active, this note confirms it.\n\nDameBola`,
      html: layout("Message received", `<p>Hello ${escapeHtml(name)},</p><p>We received your message. Our team can review it from the administration panel.</p>`),
    };
  }
  return {
    subject: "Recibimos tu mensaje — DameBola",
    text: `Hola ${name},\n\nRecibimos tu mensaje. El equipo de DameBola puede revisarlo.\n\nDameBola`,
    html: layout("Mensaje recibido", `<p>Hola ${escapeHtml(name)},</p><p>Recibimos tu mensaje. El equipo puede revisarlo desde el panel de administración.</p>`),
  };
}

export function signupAdminEmail(input: { name: string; email: string; whatsapp: string; city: string; interest: string; locale: string }) {
  const interestLabel = input.interest === "ride" ? "Viajar" : input.interest === "drive" ? "Conducir" : "Viajar y conducir";
  const lines = [
    `Nombre: ${input.name || "—"}`,
    `Correo: ${input.email}`,
    `WhatsApp: ${input.whatsapp}`,
    `Ciudad: ${input.city || "—"}`,
    `Interés: ${interestLabel}`,
    `Idioma del formulario: ${input.locale === "en" ? "Inglés" : "Español"}`,
  ];
  return {
    subject: `Nuevo registro DameBola · ${interestLabel}`,
    text: lines.join("\n"),
    html: layout("Nuevo registro", `<p>${lines.map((line) => escapeHtml(line)).join("<br>")}</p>`),
  };
}

export function subscriberEmail(locale: string, unsubscribeUrl: string) {
  if (locale === "en") {
    return {
      subject: "You're on the DameBola list",
      text: `Thanks for signing up. We'll use this list for launch news. Unsubscribe: ${unsubscribeUrl}`,
      html: layout("You're on the list", `<p>Thanks for signing up for DameBola launch news.</p><p><a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a></p>`),
    };
  }
  return {
    subject: "Quedaste en la lista de DameBola",
    text: `Gracias por registrarte. Usaremos esta lista para noticias del lanzamiento. Para darte de baja: ${unsubscribeUrl}`,
    html: layout("Quedaste en la lista", `<p>Gracias por registrarte para recibir noticias del lanzamiento de DameBola.</p><p><a href="${escapeHtml(unsubscribeUrl)}">Darme de baja</a></p>`),
  };
}

export { layout };
