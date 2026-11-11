import { prisma } from "@/lib/db";
import { saveSafety } from "@/server/admin";

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const query = await searchParams;
  const features = await prisma.safetyFeature.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Funciones de seguridad</h1>
      <p className="max-w-2xl text-sm text-slate">Marca una función como disponible solo si ya está implementada y verificada. Próximamente es el estado correcto mientras la app no la tenga.</p>
      {query.aviso === "guardado" ? <p className="text-sm text-success">Cambios guardados.</p> : null}
      {features.map((feature) => (
        <form key={feature.id} action={saveSafety} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
          <input type="hidden" name="id" value={feature.id} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{feature.titleEs}</h2>
            <select className="field max-w-xs" name="status" defaultValue={feature.status}>
              <option value="soon">Próximamente</option>
              <option value="partial">Disponible en parte</option>
              <option value="live">Disponible</option>
            </select>
          </div>
          <input className="field" name="titleEs" defaultValue={feature.titleEs} />
          <textarea className="field min-h-20" name="bodyEs" defaultValue={feature.bodyEs} />
          <input className="field" name="titleEn" defaultValue={feature.titleEn} />
          <textarea className="field min-h-20" name="bodyEn" defaultValue={feature.bodyEn} />
          <button className="min-h-11 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white">Guardar función</button>
        </form>
      ))}
    </div>
  );
}
