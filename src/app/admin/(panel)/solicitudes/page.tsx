import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const labels: Record<string, string> = {
  pending: "Pendiente",
  under_review: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  more_info: "Más información",
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  const canExport = session?.role === "owner" || session?.role === "admin";
  const page = Math.max(1, Number(query.page || 1));
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.province ? { province: query.province } : {}),
    ...(query.vehicle ? { vehicleType: query.vehicle } : {}),
    ...(query.q
      ? {
          OR: [
            { firstName: { contains: query.q } },
            { lastName: { contains: query.q } },
            { email: { contains: query.q } },
            { phone: { contains: query.q } },
            { city: { contains: query.q } },
          ],
        }
      : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.driverApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * 20, take: 20 }),
    prisma.driverApplication.count({ where }),
  ]);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Solicitudes</h1>
        {canExport ? <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/applications">Exportar CSV</a> : null}
      </div>
      <form className="mt-4 grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-line md:grid-cols-5">
        <input className="field" name="q" defaultValue={query.q} placeholder="Buscar" />
        <select className="field" name="status" defaultValue={query.status || ""}>
          <option value="">Estado</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select className="field" name="vehicle" defaultValue={query.vehicle || ""}>
          <option value="">Vehículo</option>
          <option value="car">Carro</option>
          <option value="motorcycle">Motocicleta</option>
        </select>
        <input className="field" name="province" defaultValue={query.province} placeholder="Provincia" />
        <button className="rounded-full bg-blue-600 font-semibold text-white">Filtrar</button>
      </form>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate"><tr><th className="p-3">Persona</th><th>Ciudad</th><th>Vehículo</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4 text-slate" colSpan={5}>No hay solicitudes con ese filtro.</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="p-3"><Link className="font-semibold text-blue-700" href={`/admin/solicitudes/${row.id}`}>{row.firstName} {row.lastName}</Link><div className="text-slate">{row.email}</div></td>
                <td>{row.city}</td>
                <td>{row.vehicleType === "car" ? "Carro" : "Motocicleta"}</td>
                <td>{labels[row.status] || row.status}</td>
                <td>{row.createdAt.toLocaleDateString("es-DO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate">{total} registros · página {page}</p>
      <div className="mt-2 flex gap-3 text-sm font-semibold">
        {page > 1 ? <Link href={`/admin/solicitudes?page=${page - 1}`}>Anterior</Link> : null}
        {page * 20 < total ? <Link href={`/admin/solicitudes?page=${page + 1}`}>Siguiente</Link> : null}
      </div>
    </div>
  );
}
