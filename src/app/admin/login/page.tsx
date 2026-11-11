import { LoginForm } from "@/components/admin/LoginForm";
import { safeNextPath } from "@/lib/auth";

export const metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; aviso?: string }> }) {
  const query = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 text-white">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">DameBola</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Panel privado</h1>
        <p className="mt-2 text-sm text-slate">Solo para el equipo autorizado. Las solicitudes de conductores no se aprueban solas.</p>
        {query.aviso === "clave" ? <p className="mt-3 text-sm text-success">La contraseña fue restablecida. Entra con la nueva.</p> : null}
        <LoginForm next={safeNextPath(query.next)} />
        <a className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/admin/recuperar">Olvidé mi contraseña</a>
      </div>
    </main>
  );
}
