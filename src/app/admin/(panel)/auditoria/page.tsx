import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) redirect("/admin?aviso=permiso");
  const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 150, include: { actor: true } });
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Auditoría</h1>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-line">
            <span className="font-semibold">{row.action}</span>
            <span className="text-slate"> · {row.actor?.email || "sistema"} · {row.createdAt.toLocaleString("es-DO")}</span>
            {row.entityId ? <span className="text-slate"> · {row.entityId}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
