import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) redirect("/admin?aviso=permiso");
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const active = rows.filter((row) => !row.unsubscribedAt).length;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Suscriptores</h1>
        <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/subscribers">Exportar CSV</a>
      </div>
      <p className="mt-2 text-sm text-slate">{active} activos en esta vista. No se envían campañas masivas desde el sitio.</p>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-slate"><tr><th className="p-3">Correo</th><th>WhatsApp</th><th>Ciudad</th><th>Interés</th><th>Estado</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4" colSpan={5}>Nadie se ha suscrito.</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="p-3">{row.email}<div className="text-slate">{row.name}</div></td>
                <td>{row.whatsapp || "—"}</td>
                <td>{row.city || "—"}</td>
                <td>{row.interest}</td>
                <td>{row.unsubscribedAt ? "De baja" : "Activo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
