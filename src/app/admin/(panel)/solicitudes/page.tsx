import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { adminCopy } from "@/content/admin-ui";
import { adminDateLocale, getAdminLocale } from "@/lib/admin-locale";

const statusKeys = ["pending", "under_review", "approved", "rejected", "more_info"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const dateLocale = adminDateLocale(locale);
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
        <h1 className="font-display text-3xl font-semibold">{copy.applications.title}</h1>
        {canExport ? <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/applications">{copy.common.export}</a> : null}
      </div>
      <form className="mt-4 grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-line md:grid-cols-5">
        <input className="field" name="q" defaultValue={query.q} placeholder={copy.common.search} />
        <select className="field" name="status" defaultValue={query.status || ""} aria-label={copy.common.status}>
          <option value="">{copy.common.status}</option>
          {statusKeys.map((value) => <option key={value} value={value}>{copy.status[value]}</option>)}
        </select>
        <select className="field" name="vehicle" defaultValue={query.vehicle || ""} aria-label={copy.common.vehicle}>
          <option value="">{copy.common.vehicle}</option>
          <option value="car">{copy.common.car}</option>
          <option value="motorcycle">{copy.common.motorcycle}</option>
        </select>
        <input className="field" name="province" defaultValue={query.province} placeholder={copy.applications.province} />
        <button className="rounded-full bg-blue-600 font-semibold text-white">{copy.common.filter}</button>
      </form>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate"><tr><th className="p-3">{copy.common.person}</th><th>{copy.common.city}</th><th>{copy.common.vehicle}</th><th>{copy.common.status}</th><th>{copy.common.date}</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4 text-slate" colSpan={5}>{copy.applications.empty}</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="p-3"><Link className="font-semibold text-blue-700" href={`/admin/solicitudes/${row.id}`}>{row.firstName} {row.lastName}</Link><div className="text-slate">{row.email}</div></td>
                <td>{row.city}</td>
                <td>{row.vehicleType === "car" ? copy.common.car : copy.common.motorcycle}</td>
                <td>{copy.status[row.status as keyof typeof copy.status] || row.status}</td>
                <td>{row.createdAt.toLocaleDateString(dateLocale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate">{total} {copy.applications.records} {page}</p>
      <div className="mt-2 flex gap-3 text-sm font-semibold">
        {page > 1 ? <Link href={`/admin/solicitudes?page=${page - 1}`}>{copy.common.previous}</Link> : null}
        {page * 20 < total ? <Link href={`/admin/solicitudes?page=${page + 1}`}>{copy.common.next}</Link> : null}
      </div>
    </div>
  );
}
