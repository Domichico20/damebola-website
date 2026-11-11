import { ResetPasswordForm } from "@/components/admin/ResetForms";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-ink">
        <h1 className="font-display text-3xl font-semibold">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-slate">Mínimo 12 caracteres, con mayúscula, minúscula y número.</p>
        <div className="mt-4"><ResetPasswordForm token={token} /></div>
      </div>
    </main>
  );
}
