import Link from "next/link";
import { prisma } from "@/lib/db";

const categories: Record<string, string> = {
  passenger_support: "Pasajeros",
  driver_support: "Conductores",
  driver_registration: "Preinscripción",
  partnerships: "Alianzas",
  general: "General",
  report_problem: "Reporte",
  data_deletion: "Eliminación de datos",
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.q ? { OR: [{ fullName: { contains: query.q } }, { email: { contains: query.q } }, { message: { contains: query.q } }] } : {}),
  };
  const rows = await prisma.contactInquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Mensajes</h1>
      <form className="mt-4 grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-line md:grid-cols-4">
        <input className="field" name="q" defaultValue={query.q} placeholder="Buscar" />
        <select className="field" name="status" defaultValue={query.status || ""}>
          <option value="">Estado</option>
          <option value="open">Abierto</option>
          <option value="pending">Pendiente</option>
          <option value="resolved">Resuelto</option>
        </select>
        <select className="field" name="category" defaultValue={query.category || ""}>
          <option value="">Categoría</option>
          {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button className="rounded-full bg-blue-600 font-semibold text-white">Filtrar</button>
      </form>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 ? <li className="text-slate">No hay mensajes.</li> : rows.map((row) => (
          <li key={row.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link className="font-semibold text-blue-700" href={`/admin/mensajes/${row.id}`}>{row.fullName}</Link>
              <span className="text-xs font-bold uppercase text-slate">{row.status}</span>
            </div>
            <p className="text-sm text-slate">{categories[row.category] || row.category} · {row.email}</p>
            <p className="mt-2 line-clamp-2 text-sm">{row.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
