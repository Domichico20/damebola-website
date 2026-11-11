import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { adminCopy } from "@/content/admin-ui";
import { ADMIN_PAGE_SIZE, createdAtRange, listHref, text } from "@/lib/admin-filters";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { deleteInquiry } from "@/server/admin";

const categoryKeys = ["passenger_support", "driver_support", "driver_registration", "partnerships", "general", "report_problem", "data_deletion"] as const;
const statusKeys = ["open", "pending", "resolved"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const session = await getSession();
  const canDelete = session?.role === "owner" || session?.role === "admin";
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const page = Math.max(1, Number(query.page || 1));
  const name = text(query.q);
  const email = text(query.email);
  const phone = text(query.phone);
  const createdAt = createdAtRange(query.from, query.to);
  const and: Prisma.ContactInquiryWhereInput[] = [];
  if (name) and.push({ OR: [{ fullName: { contains: name } }, { message: { contains: name } }] });
  const where: Prisma.ContactInquiryWhereInput = {
    ...(statusKeys.includes(query.status as (typeof statusKeys)[number]) ? { status: query.status } : {}),
    ...(categoryKeys.includes(query.category as (typeof categoryKeys)[number]) ? { category: query.category } : {}),
    ...(email ? { email: { contains: email } } : {}),
    ...(phone ? { phone: { contains: phone } } : {}),
    ...(createdAt ? { createdAt } : {}),
    ...(and.length ? { AND: and } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.contactInquiry.count({ where }),
  ]);
  const href = (nextPage: number) => listHref("/admin/mensajes", query, nextPage);
  const status = (value: string) => copy.status[value as keyof typeof copy.status] || value;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{copy.messages.title}</h1>
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
        <label className="text-sm font-semibold">{copy.messages.category}
          <select className="field" name="category" defaultValue={query.category || ""}>
            <option value="">{copy.messages.category}</option>
            {categoryKeys.map((value) => <option key={value} value={value}>{copy.categories[value]}</option>)}
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
      <ul className="mt-4 space-y-3">
        {rows.length === 0 ? <li className="text-slate">{copy.messages.empty}</li> : rows.map((row) => (
          <li key={row.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link className="font-semibold text-blue-700" href={`/admin/mensajes/${row.id}`}>{row.fullName}</Link>
                <p className="text-sm text-slate">{copy.common.email}: {row.email}</p>
                <p className="text-sm">{copy.common.phone}: {row.phone || "—"}</p>
                <p className="text-sm">{copy.messages.category}: {copy.categories[row.category as keyof typeof copy.categories] || row.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-slate">{status(row.status)}</span>
                <p className="text-xs text-slate">{formatAdminDateTime(row.createdAt, locale)}</p>
                {canDelete ? <ConfirmDeleteForm action={deleteInquiry} id={row.id} label={copy.common.delete} confirm={copy.messages.deleteConfirm} plain /> : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm">{row.message}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-slate">{total} {copy.common.records} {page}</p>
      <div className="mt-2 flex gap-3 text-sm font-semibold">
        {page > 1 ? <Link href={href(page - 1)}>{copy.common.previous}</Link> : null}
        {page * ADMIN_PAGE_SIZE < total ? <Link href={href(page + 1)}>{copy.common.next}</Link> : null}
      </div>
    </div>
  );
}
