import type { Dictionary } from "@/content/types";

export function CompanyInfo({ copy }: { copy: Dictionary["companyInfo"] }) {
  const rows: Array<[string, string]> = [
    [copy.legalName, copy.legalNameValue],
    [copy.registration, copy.registrationValue],
    [copy.document, copy.documentValue],
    [copy.duns, copy.dunsValue],
    [copy.website, copy.websiteValue],
    [copy.email, copy.emailValue],
  ];
  return (
    <section className="@container rounded-3xl bg-white p-6 ring-1 ring-line">
      <h2 className="font-display text-2xl font-semibold">{copy.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">{copy.brand}</p>
      <dl className="mt-5 overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-b border-line px-4 py-3 last:border-b-0 @min-[40rem]:grid-cols-[15rem_minmax(0,1fr)] @min-[40rem]:items-baseline @min-[40rem]:gap-6">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate">{label}</dt>
            <dd className="min-w-0 font-semibold text-navy-950">
              {value.startsWith("http") ? (
                <a className="text-blue-700 underline-offset-2 hover:underline" href={value}>{value.replace(/^https:\/\//, "")}</a>
              ) : value.includes("@") ? (
                <a className="text-blue-700 underline-offset-2 hover:underline" href={`mailto:${value}`}>{value}</a>
              ) : value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
