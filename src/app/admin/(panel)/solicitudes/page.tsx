import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { DocumentThumbs } from "@/components/admin/DocumentThumbs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { adminCopy } from "@/content/admin-ui";
import { ADMIN_PAGE_SIZE, createdAtRange, listHref, text } from "@/lib/admin-filters";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { deleteApplication } from "@/server/admin";

const statusKeys = ["pending", "under_review", "approved", "rejected", "more_info"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const canExport = session?.role === "owner" || session?.role === "admin";
  const page = Math.max(1, Number(query.page || 1));
  const name = text(query.q);
  const email = text(query.email);
  const phone = text(query.phone);
  const city = text(query.city);
  const province = text(query.province);
  const createdAt = createdAtRange(query.from, query.to);
  const and: Prisma.DriverApplicationWhereInput[] = [];
  if (name) and.push({ OR: [{ firstName: { contains: name } }, { lastName: { contains: name } }] });
  if (phone) and.push({ OR: [{ phone: { contains: phone } }, { whatsapp: { contains: phone } }] });
  const where: Prisma.DriverApplicationWhereInput = {
    ...(statusKeys.includes(query.status as (typeof statusKeys)[number]) ? { status: query.status } : {}),
    ...(query.vehicle === "car" || query.vehicle === "motorcycle" ? { vehicleType: query.vehicle } : {}),
    ...(email ? { email: { contains: email } } : {}),
    ...(city ? { city: { contains: city } } : {}),
    ...(province ? { province: { contains: province } } : {}),
    ...(createdAt ? { createdAt } : {}),
    ...(and.length ? { AND: and } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.driverApplication.findMany({
      where,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: { documents: true },
    }),
    prisma.driverApplication.count({ where }),
  ]);
  const href = (nextPage: number) => listHref("/admin/solicitudes", query, nextPage);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{copy.applications.title}</h1>
        {canExport ? <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/applications">{copy.common.export}</a> : null}
      </div>
      <form className="mt-4 grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-line sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-semibold">{copy.common.name}
          <input className="field" name="q" defaultValue={query.q || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.common.email}
          <input className="field" name="email" defaultValue={query.email || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.common.phone}
          <input className="field" name="phone" defaultValue={query.phone || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.common.city}
          <input className="field" name="city" defaultValue={query.city || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.applications.province}
          <input className="field" name="province" defaultValue={query.province || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.common.vehicle}
          <select className="field" name="vehicle" defaultValue={query.vehicle || ""}>
            <option value="">{copy.common.vehicle}</option>
            <option value="car">{copy.common.car}</option>
            <option value="motorcycle">{copy.common.motorcycle}</option>
          </select>
        </label>
        <label className="text-sm font-semibold">{copy.common.status}
          <select className="field" name="status" defaultValue={query.status || ""}>
            <option value="">{copy.common.status}</option>
            {statusKeys.map((value) => <option key={value} value={value}>{copy.status[value]}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">{copy.common.when}
          <select className="field" name="sort" defaultValue={query.sort === "asc" ? "asc" : "desc"}>
            <option value="desc">{copy.common.newest}</option>
            <option value="asc">{copy.common.oldest}</option>
          </select>
        </label>
        <label className="text-sm font-semibold">{copy.common.from}
          <input className="field" type="date" name="from" defaultValue={query.from || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.common.to}
          <input className="field" type="date" name="to" defaultValue={query.to || ""} />
        </label>
        <button className="self-end min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">{copy.common.filter}</button>
      </form>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="text-slate">
            <tr>
              <th className="p-3">{copy.common.person}</th>
              <th>{copy.common.city}</th>
              <th>{copy.common.vehicle}</th>
              <th>{copy.application.license}</th>
              <th>{copy.common.status}</th>
              <th>{copy.common.when}</th>
              <th>{copy.application.documents}</th>
              {canExport ? <th>{copy.common.delete}</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4 text-slate" colSpan={canExport ? 8 : 7}>{copy.applications.empty}</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="p-3">
                  <Link className="font-semibold text-blue-700" href={`/admin/solicitudes/${row.id}`}>{row.firstName} {row.lastName}</Link>
                  <div className="text-slate">{copy.common.email}: {row.email}</div>
                  <div>{copy.common.phone}: {row.phone}</div>
                  <div>{copy.common.whatsapp}: {row.whatsapp || "—"}</div>
                </td>
                <td className="p-3">{row.city}<div className="text-slate">{row.province}</div></td>
                <td className="p-3">
                  <div>{row.vehicleType === "car" ? copy.common.car : copy.common.motorcycle}</div>
                  <div>{row.vehicleMake} {row.vehicleModel}</div>
                  <div className="text-slate">{row.vehicleYear}</div>
                </td>
                <td className="p-3">{row.licenseNumber}<div className="text-slate">{row.licenseExpiry || "—"}</div></td>
                <td className="p-3">{copy.status[row.status as keyof typeof copy.status] || row.status}</td>
                <td className="p-3 whitespace-nowrap">{formatAdminDateTime(row.createdAt, locale)}</td>
                <td className="p-3">
                  {row.documents.length === 0 ? <span className="text-slate">—</span> : (
                    <DocumentThumbs
                      documents={row.documents.map((doc) => ({ id: doc.id, originalName: doc.originalName, mimeType: doc.mimeType, kind: doc.kind }))}
                      kinds={copy.application.kinds}
                      zoomIn={copy.application.zoomIn}
                      zoomOut={copy.application.zoomOut}
                      download={copy.application.download}
                      close={copy.application.close}
                      previewFailed={copy.application.previewFailed}
                      size="sm"
                    />
                  )}
                </td>
                {canExport ? (
                  <td className="p-3">
                    <ConfirmDeleteForm action={deleteApplication} id={row.id} label={copy.common.delete} confirm={copy.application.deleteConfirm} plain />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate">{total} {copy.common.records} {page}</p>
      <div className="mt-2 flex gap-3 text-sm font-semibold">
        {page > 1 ? <Link href={href(page - 1)}>{copy.common.previous}</Link> : null}
        {page * ADMIN_PAGE_SIZE < total ? <Link href={href(page + 1)}>{copy.common.next}</Link> : null}
      </div>
    </div>
  );
}
