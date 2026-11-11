"use client";

import { startTransition, useActionState, useMemo, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/types";
import { emptyPublicState } from "@/lib/form-state";
import { submitDriver } from "@/server/public";
import { localize, type Locale } from "@/lib/routes";

type Copy = Dictionary["drive"];
type Errors = Dictionary["forms"]["errors"];

export function DriverForm({
  locale,
  copy,
  errors,
  provinces,
  requirements,
  privacyHref,
  privacyLabel,
}: {
  locale: Locale;
  copy: Copy;
  errors: Errors;
  provinces: readonly string[];
  requirements: string;
  privacyHref: string;
  privacyLabel: string;
}) {
  const [state, action, pending] = useActionState(submitDriver, emptyPublicState);
  const [startedAt] = useState(() => Date.now());
  const [step, setStep] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    province: "",
    vehicleType: "car",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: String(new Date().getFullYear()),
    licenseNumber: "",
    licenseExpiry: "",
    meetsRequirements: false,
    privacyConsent: false,
  });
  const years = useMemo(() => {
    const end = new Date().getFullYear() + 1;
    return Array.from({ length: end - 1979 }, (_, index) => end - index);
  }, []);
  const shown = { ...localErrors, ...state.fieldErrors };
  const attached = Object.values(files).filter(Boolean);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate(current: number) {
    const next: Record<string, string> = {};
    if (current === 0) {
      if (values.firstName.trim().length < 2) next.firstName = errors.required;
      if (values.lastName.trim().length < 2) next.lastName = errors.required;
      if ((values.phone.match(/\d/g) || []).length < 8) next.phone = errors.phone;
      if (values.whatsapp && (values.whatsapp.match(/\d/g) || []).length < 8) next.whatsapp = errors.phone;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = errors.email;
      if (values.city.trim().length < 2) next.city = errors.required;
      if (!values.province) next.province = errors.province;
    }
    if (current === 1) {
      if (values.vehicleMake.trim().length < 2) next.vehicleMake = errors.required;
      if (!values.vehicleModel.trim()) next.vehicleModel = errors.required;
      if (!values.vehicleYear) next.vehicleYear = errors.year;
    }
    if (current === 2) {
      if (values.licenseNumber.trim().length < 4) next.licenseNumber = errors.required;
      if (!values.meetsRequirements) next.meetsRequirements = errors.requirements;
      if (!values.privacyConsent) next.privacyConsent = errors.privacy;
    }
    setLocalErrors(next);
    return Object.keys(next).length === 0;
  }

  if (state.ok) {
    return (
      <div className="rounded-3xl bg-white p-6 text-ink shadow-xl ring-1 ring-line md:p-8" role="status">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-pin-deep">{copy.formTitle}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{copy.successTitle}</h2>
        <p className="mt-3 leading-relaxed text-slate">{state.message}</p>
        {state.reference ? (
          <p className="mt-5 rounded-2xl bg-mist px-4 py-3 font-semibold">
            {copy.reference}: <span className="font-mono text-lg">{state.reference}</span>
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-slate">{copy.nextSteps}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="relative rounded-3xl bg-white p-5 text-ink shadow-xl ring-1 ring-line md:p-8"
      noValidate
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
          action(formData);
        });
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={String(startedAt)} />
      <p className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <ol className="grid grid-cols-4 gap-2">
        {copy.steps.map((label, index) => {
          const current = index === step;
          const done = index < step;
          return (
            <li key={label}>
              <button
                type="button"
                className="w-full text-left disabled:cursor-default"
                disabled={index > step}
                onClick={() => {
                  if (index < step) setStep(index);
                }}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${current ? "bg-navy-900 text-white" : done ? "bg-blue-600 text-white" : "bg-mist text-slate"}`}>{index + 1}</span>
                <span className={`mt-2 block text-xs font-semibold leading-snug ${current ? "text-ink" : "text-slate"}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${((step + 1) / copy.steps.length) * 100}%` }} />
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{locale === "en" ? `Step ${step + 1} of ${copy.steps.length}` : `Paso ${step + 1} de ${copy.steps.length}`}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{copy.steps[step]}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate">{copy.stepIntros[step]}</p>
        {step < 3 ? <p className="mt-2 text-xs font-semibold text-slate">{copy.requiredNote}</p> : null}
      </div>
      {state.message ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{state.message}</p> : null}

      <div className={step === 0 ? "mt-6 grid gap-4 md:grid-cols-2" : "hidden"}>
        <Field label={copy.firstName} name="firstName" value={values.firstName} error={shown.firstName} autoComplete="given-name" placeholder={copy.examples.firstName} onChange={(value) => set("firstName", value)} />
        <Field label={copy.lastName} name="lastName" value={values.lastName} error={shown.lastName} autoComplete="family-name" placeholder={copy.examples.lastName} onChange={(value) => set("lastName", value)} />
        <Field label={copy.phone} name="phone" type="tel" value={values.phone} error={shown.phone} hint={copy.phoneHint} autoComplete="tel" placeholder={copy.examples.phone} onChange={(value) => set("phone", value)} />
        <Field label={copy.whatsapp} name="whatsapp" type="tel" value={values.whatsapp} error={shown.whatsapp} optional={copy.optional} autoComplete="tel" placeholder={copy.examples.phone} onChange={(value) => set("whatsapp", value)} />
        <Field label={copy.email} name="email" type="email" value={values.email} error={shown.email} autoComplete="email" placeholder={copy.examples.email} onChange={(value) => set("email", value)} />
        <Field label={copy.city} name="city" value={values.city} error={shown.city} autoComplete="address-level2" placeholder={copy.examples.city} onChange={(value) => set("city", value)} />
        <label className="block md:col-span-2">
          <FieldLabel label={copy.province} />
          <select className="field" name="province" value={values.province} autoComplete="address-level1" aria-invalid={shown.province ? true : undefined} onChange={(event) => set("province", event.target.value)}>
            <option value="">{copy.selectProvince}</option>
            {provinces.map((province) => <option key={province} value={province}>{province}</option>)}
          </select>
          {shown.province ? <span className="mt-1 block text-sm font-medium text-danger">{shown.province}</span> : null}
        </label>
      </div>

      <div className={step === 1 ? "mt-6 grid gap-4 md:grid-cols-2" : "hidden"}>
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-semibold text-ink">{copy.vehicleType} <span className="text-danger">*</span></legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[["car", copy.car], ["motorcycle", copy.motorcycle]].map(([value, label]) => (
              <label key={value} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border font-semibold ${values.vehicleType === value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-line text-ink"}`}>
                <input className="sr-only" type="radio" name="vehicleType" value={value} checked={values.vehicleType === value} onChange={() => set("vehicleType", value)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label={copy.make} name="vehicleMake" value={values.vehicleMake} error={shown.vehicleMake} placeholder={copy.examples.make} onChange={(value) => set("vehicleMake", value)} />
        <Field label={copy.model} name="vehicleModel" value={values.vehicleModel} error={shown.vehicleModel} placeholder={copy.examples.model} onChange={(value) => set("vehicleModel", value)} />
        <label className="block">
          <FieldLabel label={copy.year} />
          <select className="field" name="vehicleYear" value={values.vehicleYear} onChange={(event) => set("vehicleYear", event.target.value)}>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
      </div>

      <div className={step === 2 ? "mt-6 space-y-4" : "hidden"}>
        <div className="rounded-2xl bg-mist p-4 text-sm leading-relaxed text-slate whitespace-pre-line">{requirements}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={copy.licenseNumber} name="licenseNumber" value={values.licenseNumber} error={shown.licenseNumber} placeholder={copy.examples.license} onChange={(value) => set("licenseNumber", value)} />
          <label className="block">
            <FieldLabel label={copy.licenseExpiry} optional={copy.optional} />
            <input className="field" type="date" name="licenseExpiry" value={values.licenseExpiry} onChange={(event) => set("licenseExpiry", event.target.value)} />
          </label>
        </div>
        <div>
          <h3 className="font-semibold text-ink">{copy.documentsTitle}</h3>
          <p className="mt-1 text-sm text-slate">{copy.documentsHint}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <FileField label={copy.licenseFile} name="licenseFile" error={shown.licenseFile} optional={copy.optional} onName={(name) => setFiles((current) => ({ ...current, licenseFile: name }))} />
            <FileField label={copy.registrationFile} name="registrationFile" error={shown.registrationFile} optional={copy.optional} onName={(name) => setFiles((current) => ({ ...current, registrationFile: name }))} />
            <FileField label={copy.insuranceFile} name="insuranceFile" error={shown.insuranceFile} optional={copy.optional} onName={(name) => setFiles((current) => ({ ...current, insuranceFile: name }))} />
            <FileField label={copy.otherFile} name="otherFile" error={shown.otherFile} optional={copy.optional} onName={(name) => setFiles((current) => ({ ...current, otherFile: name }))} />
          </div>
        </div>
        <Check name="meetsRequirements" checked={values.meetsRequirements} error={shown.meetsRequirements} onChange={(checked) => set("meetsRequirements", checked)}>
          {copy.meets}
        </Check>
        <Check name="privacyConsent" checked={values.privacyConsent} error={shown.privacyConsent} onChange={(checked) => set("privacyConsent", checked)}>
          {copy.privacy} <a className="font-semibold text-blue-700 underline" href={privacyHref}>{privacyLabel}</a>
        </Check>
      </div>

      {step === 3 ? (
        <div className="mt-6 rounded-2xl bg-mist p-4 text-sm">
          <p className="leading-relaxed text-slate">{copy.reviewNote}</p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            <Item label={copy.firstName} value={`${values.firstName} ${values.lastName}`} />
            <Item label={copy.email} value={values.email} />
            <Item label={copy.phone} value={values.phone} />
            <Item label={copy.whatsapp} value={values.whatsapp || "—"} />
            <Item label={copy.city} value={`${values.city}, ${values.province}`} />
            <Item label={copy.vehicleType} value={values.vehicleType === "motorcycle" ? copy.motorcycle : copy.car} />
            <Item label={copy.make} value={`${values.vehicleMake} ${values.vehicleModel} · ${values.vehicleYear}`} />
            <Item label={copy.licenseNumber} value={values.licenseExpiry ? `${values.licenseNumber} · ${values.licenseExpiry}` : values.licenseNumber} />
            <Item label={copy.documentsTitle} value={attached.length ? attached.join(", ") : copy.documentsNone} />
          </dl>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" className="inline-flex min-h-12 items-center rounded-full border border-line px-5 font-semibold text-ink" onClick={() => setStep((value) => value - 1)}>
            {copy.back}
          </button>
        ) : null}
        {step < 3 ? (
          <button
            type="button"
            className="inline-flex min-h-12 items-center rounded-full bg-blue-600 px-5 font-semibold text-white"
            onClick={() => {
              if (validate(step)) setStep((value) => value + 1);
            }}
          >
            {copy.next}
          </button>
        ) : (
          <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center rounded-full bg-pin px-5 font-semibold text-navy-950 disabled:opacity-60">
            {pending ? "…" : copy.submit}
          </button>
        )}
      </div>
    </form>
  );
}

function FieldLabel({ label, optional }: { label: string; optional?: string }) {
  return (
    <span className="mb-0 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
      <span>{label}{optional ? null : <span className="text-danger"> *</span>}</span>
      {optional ? <span className="text-xs font-semibold uppercase tracking-wide text-slate">{optional}</span> : null}
    </span>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  hint,
  optional,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  optional?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} optional={optional} />
      <input
        className={`field ${error ? "border-danger" : ""}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="mt-1 block text-sm font-normal text-slate">{hint}</span> : null}
      {error ? <span className="mt-1 block text-sm font-medium text-danger">{error}</span> : null}
    </label>
  );
}

function FileField({ label, name, error, optional, onName }: { label: string; name: string; error?: string; optional: string; onName: (name: string) => void }) {
  return (
    <label className="block rounded-2xl border border-dashed border-line bg-paper px-4 py-3">
      <FieldLabel label={label} optional={optional} />
      <input
        className="mt-2 block w-full text-sm text-slate file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
        type="file"
        name={name}
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={(event) => onName(event.target.files?.[0]?.name || "")}
      />
      {error ? <span className="mt-1 block text-sm text-danger">{error}</span> : null}
    </label>
  );
}

function Check({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
      <input className="mt-1 h-5 w-5 shrink-0" type="checkbox" name={name} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        {children}
        {error ? <span className="mt-1 block font-medium text-danger">{error}</span> : null}
      </span>
    </label>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}

export function privacyPath(locale: Locale) {
  return localize(locale, "/legal/privacidad");
}
