import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/server/admin";

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const settings = await getSettings();
  const query = await searchParams;
  const fields = [
    ["supportEmail", "Correo de contacto"],
    ["whatsappNumber", "WhatsApp, con código de país"],
    ["companyAddress", "Dirección, si ya está confirmada"],
    ["legalName", "Nombre legal visible"],
    ["socialInstagram", "Instagram URL"],
    ["socialFacebook", "Facebook URL"],
    ["socialX", "X URL"],
    ["socialTiktok", "TikTok URL"],
    ["socialYoutube", "YouTube URL"],
    ["appStorePassenger", "App Store pasajeros"],
    ["playStorePassenger", "Google Play pasajeros"],
    ["appStoreDriver", "App Store conductores"],
    ["playStoreDriver", "Google Play conductores"],
    ["gaMeasurementId", "Google Analytics ID (G-...)"],
  ] as const;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Ajustes</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate">Deja vacíos los enlaces de tiendas y redes hasta que sean oficiales. Un enlace vacío muestra “Próximamente”, no un botón falso.</p>
      {query.aviso === "guardado" ? <p className="mt-3 text-sm text-success">Ajustes guardados.</p> : null}
      <form action={saveSettings} className="mt-4 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line">
        {fields.map(([key, label]) => (
          <label key={key} className="text-sm font-semibold">{label}
            <input className="field" name={key} defaultValue={settings[key]} />
          </label>
        ))}
        <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white">Guardar ajustes</button>
      </form>
    </div>
  );
}
