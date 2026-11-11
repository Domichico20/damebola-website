import { adminCopy } from "@/content/admin-ui";
import { getSession } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) {
    const denied = (await getAdminLocale()) === "en" ? "Not authorized" : "No autorizado";
    return new Response(denied, { status: 401 });
  }
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const header = locale === "en"
    ? "email,name,whatsapp,city,interest,status,date"
    : "correo,nombre,whatsapp,ciudad,interes,estado,fecha";
  const interest = (value: string) => copy.subscribers[value as "ride" | "drive" | "both"] || value;
  const body = [header, ...rows.map((row) =>
    [row.email, row.name || "", row.whatsapp || "", row.city || "", interest(row.interest), row.unsubscribedAt ? copy.subscribers.gone : copy.subscribers.active, row.createdAt.toISOString()]
      .map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
  )].join("\n");
  await writeAudit({ actorId: session.id, action: "export_subscribers" });
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${locale === "en" ? "subscribers-damebola.csv" : "suscriptores-damebola.csv"}`,
      "Cache-Control": "private, no-store",
    },
  });
}
