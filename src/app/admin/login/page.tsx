import { Suspense } from "react";
import { LanguageSwitch } from "@/components/admin/LanguageSwitch";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminCopy } from "@/content/admin-ui";
import { safeNextPath } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; aviso?: string }> }) {
  const query = await searchParams;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 text-white">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">DameBola</p>
          <Suspense fallback={null}>
            <LanguageSwitch locale={locale} label={copy.language} />
          </Suspense>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold">{copy.login.title}</h1>
        <p className="mt-2 text-sm text-slate">{copy.login.body}</p>
        {query.aviso === "clave" ? <p className="mt-3 text-sm text-success">{copy.login.resetDone}</p> : null}
        <LoginForm next={safeNextPath(query.next)} copy={copy.login} />
        <a className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/admin/recuperar">{copy.login.forgot}</a>
      </div>
    </main>
  );
}
