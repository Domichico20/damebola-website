import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { adminCopy } from "@/content/admin-ui";
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const query = await searchParams;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const since = new Date();
  since.setDate(since.getDate() - 6);
  const day = since.toISOString().slice(0, 10);
  const [total, pending, approved, openMessages, subscribers, views, recentApps, recentMessages] = await Promise.all([
    prisma.driverApplication.count(),
    prisma.driverApplication.count({ where: { status: "pending" } }),
    prisma.driverApplication.count({ where: { status: "approved" } }),
    prisma.contactInquiry.count({ where: { status: "open" } }),
    prisma.subscriber.count({ where: { unsubscribedAt: null } }),
    prisma.pageViewDaily.aggregate({ _sum: { count: true }, where: { day: { gte: day } } }),
    prisma.driverApplication.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    [copy.dashboard.cards[0], total, "/admin/solicitudes"],
    [copy.dashboard.cards[1], pending, "/admin/solicitudes?status=pending"],
    [copy.dashboard.cards[2], approved, "/admin/solicitudes?status=approved"],
    [copy.dashboard.cards[3], openMessages, "/admin/mensajes?status=open"],
    [copy.dashboard.cards[4], subscribers, "/admin/suscriptores"],
    [copy.dashboard.cards[5], views._sum.count || 0, "/admin"],
  ] as const;
  const status = (value: string) => copy.status[value as keyof typeof copy.status] || value;
  const category = (value: string) => copy.categories[value as keyof typeof copy.categories] || value;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{copy.dashboard.title}</h1>
      {query.aviso === "permiso" ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm">{copy.dashboard.denied}</p> : null}
      <p className="mt-2 max-w-2xl text-sm text-slate">{copy.dashboard.visits}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-3xl bg-white p-5 ring-1 ring-line">
            <p className="text-sm text-slate">{label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-line">
          <h2 className="font-semibold">{copy.dashboard.recentApps}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recentApps.length === 0 ? <li className="text-slate">{copy.dashboard.noApps}</li> : recentApps.map((item) => (
              <li key={item.id}><Link className="font-semibold text-blue-700" href={`/admin/solicitudes/${item.id}`}>{item.firstName} {item.lastName}</Link> · {item.email} · {item.phone} · {item.city} · {status(item.status)} · {formatAdminDateTime(item.createdAt, locale)}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl bg-white p-5 ring-1 ring-line">
          <h2 className="font-semibold">{copy.dashboard.recentMessages}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recentMessages.length === 0 ? <li className="text-slate">{copy.dashboard.noMessages}</li> : recentMessages.map((item) => (
              <li key={item.id}><Link className="font-semibold text-blue-700" href={`/admin/mensajes/${item.id}`}>{item.fullName}</Link> · {item.email} · {item.phone || "—"} · {category(item.category)} · {status(item.status)} · {formatAdminDateTime(item.createdAt, locale)}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
