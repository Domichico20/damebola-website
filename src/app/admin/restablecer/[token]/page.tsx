import { Suspense } from "react";
import { LanguageSwitch } from "@/components/admin/LanguageSwitch";
import { ResetPasswordForm } from "@/components/admin/ResetForms";
import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-ink">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold">{copy.reset.title}</h1>
          <Suspense fallback={null}>
            <LanguageSwitch locale={locale} label={copy.language} />
          </Suspense>
        </div>
        <p className="mt-2 text-sm text-slate">{copy.reset.hint}</p>
        <div className="mt-4"><ResetPasswordForm token={token} copy={copy.reset} /></div>
      </div>
    </main>
  );
}
