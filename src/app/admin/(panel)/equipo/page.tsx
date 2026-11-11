import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";
import { disableStaffTotp, setStaffActive } from "@/server/admin";
import { TeamForm } from "@/components/admin/TeamForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "owner") redirect("/admin?aviso=permiso");
  const query = await searchParams;
  const copy = adminCopy(await getAdminLocale());
  const people = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  const roleName = (role: string) => (role === "owner" || role === "admin" || role === "support" ? copy.roles[role] : role);
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">{copy.team.title}</h1>
      {query.aviso === "propia" ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm">{copy.team.own}</p> : null}
      <TeamForm copy={copy.team} />
      <ul className="space-y-3">
        {people.map((person) => (
          <li key={person.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <p className="font-semibold">{person.name}</p>
            <p className="text-sm text-slate">{person.email} · {roleName(person.role)} · {person.active ? copy.team.active : copy.team.inactive} · 2FA {person.totpEnabled ? copy.team.yes : copy.team.no}</p>
            {person.id !== session.id ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={setStaffActive}>
                  <input type="hidden" name="id" value={person.id} />
                  <input type="hidden" name="active" value={person.active ? "false" : "true"} />
                  <button className="rounded-full bg-navy-900 px-3 py-2 text-sm font-semibold text-white">{person.active ? copy.team.deactivate : copy.team.activate}</button>
                </form>
                {person.totpEnabled ? (
                  <form action={disableStaffTotp}>
                    <input type="hidden" name="id" value={person.id} />
                    <button className="rounded-full px-3 py-2 text-sm font-semibold text-danger">{copy.team.removeTotp}</button>
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
