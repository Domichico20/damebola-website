import { getSession } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

function csv(rows: string[][]) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
}

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) {
    const denied = (await getAdminLocale()) === "en" ? "Not authorized" : "No autorizado";
    return new Response(denied, { status: 401 });
  }
  const locale = await getAdminLocale();
  const rows = await prisma.driverApplication.findMany({ orderBy: { createdAt: "desc" } });
  const headers = locale === "en"
    ? ["id", "date", "status", "first_name", "last_name", "phone", "whatsapp", "email", "city", "province", "vehicle", "make", "model", "year", "license", "expires"]
    : ["id", "fecha", "estado", "nombre", "apellidos", "telefono", "whatsapp", "correo", "ciudad", "provincia", "vehiculo", "marca", "modelo", "ano", "licencia", "vencimiento"];
  const body = csv([
    headers,
    ...rows.map((row) => [
      row.id, row.createdAt.toISOString(), row.status, row.firstName, row.lastName, row.phone, row.whatsapp || "", row.email,
      row.city, row.province, row.vehicleType, row.vehicleMake, row.vehicleModel, String(row.vehicleYear), row.licenseNumber, row.licenseExpiry || "",
    ]),
  ]);
  await writeAudit({ actorId: session.id, action: "export_applications" });
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${locale === "en" ? "applications-damebola.csv" : "solicitudes-damebola.csv"}`,
      "Cache-Control": "private, no-store",
    },
  });
}
