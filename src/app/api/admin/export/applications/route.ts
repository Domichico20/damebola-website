import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

function csv(rows: string[][]) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
}

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) return new Response("No autorizado", { status: 401 });
  const rows = await prisma.driverApplication.findMany({ orderBy: { createdAt: "desc" } });
  const body = csv([
    ["id", "fecha", "estado", "nombre", "apellidos", "telefono", "whatsapp", "correo", "ciudad", "provincia", "vehiculo", "marca", "modelo", "ano", "licencia", "vencimiento"],
    ...rows.map((row) => [
      row.id, row.createdAt.toISOString(), row.status, row.firstName, row.lastName, row.phone, row.whatsapp || "", row.email,
      row.city, row.province, row.vehicleType, row.vehicleMake, row.vehicleModel, String(row.vehicleYear), row.licenseNumber, row.licenseExpiry || "",
    ]),
  ]);
  await writeAudit({ actorId: session.id, action: "export_applications" });
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=solicitudes-damebola.csv",
      "Cache-Control": "private, no-store",
    },
  });
}
