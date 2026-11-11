import { adminCopy, type AdminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";
import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/server/admin";

const fields = [
  "supportEmail",
  "whatsappNumber",
  "companyAddress",
  "legalName",
  "socialInstagram",
  "socialFacebook",
  "socialX",
  "socialTiktok",
  "socialYoutube",
  "appStorePassenger",
  "playStorePassenger",
  "appStoreDriver",
  "playStoreDriver",
  "gaMeasurementId",
] as const satisfies readonly (keyof AdminCopy["settings"]["fields"])[];

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const settings = await getSettings();
  const query = await searchParams;
  const copy = adminCopy(await getAdminLocale());
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{copy.settings.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate">{copy.settings.help}</p>
      {query.aviso === "guardado" ? <p className="mt-3 text-sm text-success">{copy.settings.saved}</p> : null}
      <form action={saveSettings} className="mt-4 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line">
        {fields.map((key) => (
          <label key={key} className="text-sm font-semibold">{copy.settings.fields[key]}
            <input className="field" name={key} defaultValue={settings[key]} />
          </label>
        ))}
        <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white">{copy.settings.save}</button>
      </form>
    </div>
  );
}
