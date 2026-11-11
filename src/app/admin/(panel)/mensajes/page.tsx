import Link from "next/link";
import { prisma } from "@/lib/db";
import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";

const categoryKeys = ["passenger_support", "driver_support", "driver_registration", "partnerships", "general", "report_problem", "data_deletion"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.q ? { OR: [{ fullName: { contains: query.q } }, { email: { contains: query.q } }, { message: { contains: query.q } }] } : {}),
  };
  const rows = await prisma.contactInquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  const status = (value: string) => copy.status[value as keyof typeof copy.status] || value;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{copy.messages.title}</h1>
      <form className="mt-4 grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-line md:grid-cols-4">
        <input className="field" name="q" defaultValue={query.q} placeholder={copy.common.search} />
        <select className="field" name="status" defaultValue={query.status || ""} aria-label={copy.common.status}>
          <option value="">{copy.common.status}</option>
          <option value="open">{copy.status.open}</option>
          <option value="pending">{copy.status.pending}</option>
          <option value="resolved">{copy.status.resolved}</option>
        </select>
        <select className="field" name="category" defaultValue={query.category || ""} aria-label={copy.messages.category}>
          <option value="">{copy.messages.category}</option>
          {categoryKeys.map((value) => <option key={value} value={value}>{copy.categories[value]}</option>)}
        </select>
        <button className="rounded-full bg-blue-600 font-semibold text-white">{copy.common.filter}</button>
      </form>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 ? <li className="text-slate">{copy.messages.empty}</li> : rows.map((row) => (
          <li key={row.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link className="font-semibold text-blue-700" href={`/admin/mensajes/${row.id}`}>{row.fullName}</Link>
              <span className="text-xs font-bold uppercase text-slate">{status(row.status)}</span>
            </div>
            <p className="text-sm text-slate">{copy.categories[row.category as keyof typeof copy.categories] || row.category} · {row.email}</p>
            <p className="mt-2 line-clamp-2 text-sm">{row.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
