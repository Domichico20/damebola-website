import { ResetRequestForm } from "@/components/admin/ResetForms";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-ink">
        <h1 className="font-display text-3xl font-semibold">Recuperar acceso</h1>
        <div className="mt-4"><ResetRequestForm /></div>
        <a className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/admin/login">Volver a entrar</a>
      </div>
    </main>
  );
}
