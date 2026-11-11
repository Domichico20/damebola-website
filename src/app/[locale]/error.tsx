"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">No pudimos cargar esta vista</h1>
      <p className="mt-3 text-slate">Inténtalo otra vez. Si sigue pasando, escribe a Info@DameBolaApp.com.</p>
      <button className="mt-6 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white" onClick={reset} type="button">Reintentar</button>
    </div>
  );
}
