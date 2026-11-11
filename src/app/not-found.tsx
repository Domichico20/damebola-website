import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Esta página no está en el mapa.</h1>
      <p className="mt-3 text-slate">The page is not on the map.</p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white" href="/">Inicio</Link>
        <Link className="rounded-full bg-navy-900 px-5 py-3 font-semibold text-white" href="/en">English</Link>
      </div>
    </main>
  );
}
