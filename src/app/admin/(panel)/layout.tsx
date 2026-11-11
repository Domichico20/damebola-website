import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LanguageSwitch } from "@/components/admin/LanguageSwitch";
import { adminCopy } from "@/content/admin-ui";
import { getSession } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { logoutAction } from "@/server/admin";

export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

const links = [
  ["/admin", "home", "all"],
  ["/admin/solicitudes", "applications", "all"],
  ["/admin/mensajes", "messages", "all"],
  ["/admin/suscriptores", "subscribers", "editor"],
  ["/admin/contenido", "content", "editor"],
  ["/admin/ayuda", "help", "editor"],
  ["/admin/funciones", "safety", "editor"],
  ["/admin/ajustes", "settings", "editor"],
  ["/admin/equipo", "team", "owner"],
  ["/admin/auditoria", "audit", "editor"],
  ["/admin/cuenta", "account", "all"],
] as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const pathname = (await headers()).get("x-pathname") || "";
  if (session.mustChangePassword && !pathname.startsWith("/admin/cuenta")) redirect("/admin/cuenta?cambio=1");
  const visible = links.filter((item) => {
    if (item[2] === "owner") return session.role === "owner";
    if (item[2] === "editor") return session.role === "owner" || session.role === "admin";
    return true;
  });
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="bg-navy-950 text-white lg:w-64 lg:shrink-0">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/admin" className="font-display text-xl font-semibold">DameBola</Link>
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{copy.roles[session.role]}</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1" aria-label={copy.nav.label}>
            {visible.map(([href, key]) => (
              <Link key={href} href={href} className={`block whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "bg-white/15" : "text-white/75 hover:bg-white/10"}`}>
                {copy.nav[key]}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="px-3 pb-4">
            <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/10" type="submit">{copy.nav.logout}</button>
          </form>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-4">
            <p className="text-sm text-slate">{session.name}</p>
            <div className="flex items-center gap-3">
              <Suspense fallback={null}>
                <LanguageSwitch locale={locale} label={copy.language} />
              </Suspense>
              <p className="text-xs text-slate">{session.email}</p>
            </div>
          </header>
          <div className="px-5 py-6 md:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
