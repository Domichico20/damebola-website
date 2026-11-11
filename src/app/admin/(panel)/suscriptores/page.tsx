import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { adminCopy } from "@/content/admin-ui";
import { ADMIN_PAGE_SIZE, createdAtRange, listHref, text } from "@/lib/admin-filters";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { deleteSubscriber } from "@/server/admin";
import { redirect } from "next/navigation";

const interests = ["ride", "drive", "both"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "admin")) redirect("/admin?aviso=permiso");
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const page = Math.max(1, Number(query.page || 1));
  const name = text(query.q);
  const email = text(query.email);
  const phone = text(query.phone);
  const city = text(query.city);
  const interest = interests.includes(query.interest as (typeof interests)[number]) ? query.interest : undefined;
  const createdAt = createdAtRange(query.from, query.to);
  const where: Prisma.SubscriberWhereInput = {
    ...(name ? { name: { contains: name } } : {}),
    ...(email ? { email: { contains: email } } : {}),
    ...(phone ? { whatsapp: { contains: phone } } : {}),
    ...(city ? { city: { contains: city } } : {}),
    ...(interest ? { interest } : {}),
    ...(query.status === "active" ? { unsubscribedAt: null } : {}),
    ...(query.status === "unsubscribed" ? { unsubscribedAt: { not: null } } : {}),
    ...(createdAt ? { createdAt } : {}),
  };
  const [rows, total, active] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.subscriber.count({ where }),
    prisma.subscriber.count({ where: { AND: [where, { unsubscribedAt: null }] } }),
  ]);
  const href = (nextPage: number) => listHref("/admin/suscriptores", query, nextPage);
  const interestLabel = (value: string) => copy.subscribers[value as "ride" | "drive" | "both"] || value;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{copy.subscribers.title}</h1>
        <a className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/subscribers">{copy.common.export}</a>
      </div>
      <p className="mt-2 text-sm text-slate">{active} {copy.subscribers.summary}</p>
      <form className="mt-4 grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-line sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-semibold">{copy.subscribers.name}
          <input className="field" name="q" defaultValue={query.q || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.subscribers.email}
          <input className="field" name="email" defaultValue={query.email || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.subscribers.whatsapp}
          <input className="field" name="phone" defaultValue={query.phone || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.subscribers.city}
          <input className="field" name="city" defaultValue={query.city || ""} />
        </label>
        <label className="text-sm font-semibold">{copy.subscribers.interest}
          <select className="field" name="interest" defaultValue={interest || ""}>
            <option value="">{copy.subscribers.interest}</option>
            {interests.map((value) => <option key={value} value={value}>{interestLabel(value)}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">{copy.subscribers.status}
          <select className="field" name="status" defaultValue={query.status === "active" || query.status === "unsubscribed" ? query.status : ""}>
            <option value="">{copy.subscribers.status}</option>
            <option value="active">{copy.subscribers.active}</option>
            <option value="unsubscribed">{copy.subscribers.gone}</option>
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
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-slate">
            <tr>
              <th className="p-3">{copy.subscribers.name}</th>
              <th>{copy.subscribers.email}</th>
              <th>{copy.subscribers.whatsapp}</th>
              <th>{copy.subscribers.city}</th>
              <th>{copy.subscribers.interest}</th>
              <th>{copy.common.when}</th>
              <th>{copy.subscribers.status}</th>
              <th>{copy.common.delete}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-4" colSpan={8}>{copy.subscribers.empty}</td></tr> : rows.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="p-3">{row.name || "—"}</td>
                <td className="p-3">{row.email}</td>
                <td className="p-3">{row.whatsapp || "—"}</td>
                <td className="p-3">{row.city || "—"}</td>
                <td className="p-3">{interestLabel(row.interest)}</td>
                <td className="p-3 whitespace-nowrap">{formatAdminDateTime(row.createdAt, locale)}</td>
                <td className="p-3">{row.unsubscribedAt ? copy.subscribers.gone : copy.subscribers.active}</td>
                <td className="p-3">
                  <ConfirmDeleteForm action={deleteSubscriber} id={row.id} label={copy.common.delete} confirm={copy.subscribers.deleteConfirm} plain />
                </td>
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
