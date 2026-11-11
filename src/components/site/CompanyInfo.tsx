import type { Dictionary } from "@/content/types";

export function CompanyInfo({ copy }: { copy: Dictionary["companyInfo"] }) {
  const rows: Array<[string, string]> = [
    [copy.legalName, copy.legalNameValue],
    [copy.registration, copy.registrationValue],
    [copy.document, copy.documentValue],
    [copy.website, copy.websiteValue],
    [copy.email, copy.emailValue],
  ];
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-line">
      <h2 className="font-display text-2xl font-semibold">{copy.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">{copy.brand}</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-paper px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate">{label}</dt>
            <dd className="mt-1 font-semibold break-all">
              {value.startsWith("http") ? (
                <a className="text-blue-700" href={value}>{value.replace(/^https:\/\//, "")}</a>
              ) : value.includes("@") ? (
                <a className="text-blue-700" href={`mailto:${value}`}>{value}</a>
              ) : value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
