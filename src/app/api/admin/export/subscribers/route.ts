import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) return new Response("No autorizado", { status: 401 });
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const body = ["correo,nombre,whatsapp,ciudad,interes,estado,fecha", ...rows.map((row) =>
    [row.email, row.name || "", row.whatsapp || "", row.city || "", row.interest, row.unsubscribedAt ? "baja" : "activo", row.createdAt.toISOString()]
      .map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
  )].join("\n");
  await writeAudit({ actorId: session.id, action: "export_subscribers" });
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=suscriptores-damebola.csv",
      "Cache-Control": "private, no-store",
    },
  });
}
