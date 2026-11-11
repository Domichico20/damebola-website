import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { disableStaffTotp, setStaffActive } from "@/server/admin";
import { TeamForm } from "@/components/admin/TeamForm";

export default async function Page() {
  const session = await getSession();
  if (!session || session.role !== "owner") redirect("/admin?aviso=permiso");
  const people = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Equipo</h1>
      <TeamForm />
      <ul className="space-y-3">
        {people.map((person) => (
          <li key={person.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <p className="font-semibold">{person.name}</p>
            <p className="text-sm text-slate">{person.email} · {person.role} · {person.active ? "Activa" : "Inactiva"} · 2FA {person.totpEnabled ? "sí" : "no"}</p>
            {person.id !== session.id ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={setStaffActive}>
                  <input type="hidden" name="id" value={person.id} />
                  <input type="hidden" name="active" value={person.active ? "false" : "true"} />
                  <button className="rounded-full bg-navy-900 px-3 py-2 text-sm font-semibold text-white">{person.active ? "Desactivar" : "Activar"}</button>
                </form>
                {person.totpEnabled ? (
                  <form action={disableStaffTotp}>
                    <input type="hidden" name="id" value={person.id} />
                    <button className="rounded-full px-3 py-2 text-sm font-semibold text-danger">Quitar doble factor</button>
                  </form>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
