import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { adminCopy } from "@/content/admin-ui";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) redirect("/admin?aviso=permiso");
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const oldestFirst = query.sort === "asc";
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: oldestFirst ? "asc" : "desc" }, take: 200 });
  const active = rows.filter((row) => !row.unsubscribedAt).length;
  const interest = (value: string) => copy.subscribers[value as "ride" | "drive" | "both"] || value;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{copy.subscribers.title}</h1>
        <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/subscribers">{copy.common.export}</a>
      </div>
      <p className="mt-2 text-sm text-slate">{active} {copy.subscribers.summary}</p>
      <form className="mt-4 grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-line sm:grid-cols-[16rem_auto] sm:items-end">
        <label className="text-sm font-semibold">{copy.common.when}
          <select className="field" name="sort" defaultValue={oldestFirst ? "asc" : "desc"}>
            <option value="desc">{copy.common.newest}</option>
            <option value="asc">{copy.common.oldest}</option>
          </select>
        </label>
        <button className="min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">{copy.common.filter}</button>
      </form>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-slate"><tr><th className="p-3">{copy.subscribers.email}</th><th>{copy.subscribers.whatsapp}</th><th>{copy.subscribers.city}</th><th>{copy.subscribers.interest}</th><th>{copy.common.when}</th><th>{copy.subscribers.status}</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4" colSpan={6}>{copy.subscribers.empty}</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="p-3">{row.email}<div className="text-slate">{row.name}</div></td>
                <td>{row.whatsapp || "—"}</td>
                <td>{row.city || "—"}</td>
                <td>{interest(row.interest)}</td>
                <td className="whitespace-nowrap">{formatAdminDateTime(row.createdAt, locale)}</td>
                <td>{row.unsubscribedAt ? copy.subscribers.gone : copy.subscribers.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
