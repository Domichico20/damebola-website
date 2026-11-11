"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useActionState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/content/types";
import { emptyPublicState } from "@/lib/form-state";
import { confirmUnsubscribe, submitContact, submitNewsletter } from "@/server/public";
import type { Locale } from "@/lib/routes";

export function ContactForm({
  locale,
  copy,
  categories,
  presetCategory,
  presetMessage,
}: {
  locale: Locale;
  copy: Dictionary["contact"];
  categories: Array<{ value: string; label: string }>;
  presetCategory?: string;
  presetMessage?: string;
}) {
  const [state, action, pending] = useActionState(submitContact, emptyPublicState);
  const [startedAt] = useState(() => Date.now());
  if (state.ok) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-line" role="status">
        <h2 className="font-display text-3xl font-semibold">{copy.successTitle}</h2>
        <p className="mt-3 leading-relaxed text-slate">{state.message}</p>
      </div>
    );
  }
  return (
    <form action={action} className="relative grid gap-4 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-line md:p-8" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={startedAt} />
      <p className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </p>
      {state.message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{state.message}</p> : null}
      <Label label={copy.name} name="fullName" error={state.fieldErrors.fullName} />
      <Label label={copy.email} name="email" type="email" error={state.fieldErrors.email} />
      <Label label={copy.phone} name="phone" error={state.fieldErrors.phone} />
      <label className="text-sm font-semibold">
        {copy.reason}
        <select className="field" name="category" defaultValue={presetCategory || categories[0]?.value}>
          {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">
        {copy.message}
        <textarea className="field min-h-36" name="message" defaultValue={presetMessage} aria-invalid={state.fieldErrors.message ? true : undefined} />
        {state.fieldErrors.message ? <span className="mt-1 block text-danger">{state.fieldErrors.message}</span> : null}
      </label>
      <button disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-5 font-semibold text-white disabled:opacity-60" type="submit">
        {pending ? "…" : copy.send}
      </button>
    </form>
  );
}

export function NewsletterForm({ locale, dict, dark = false }: { locale: Locale; dict: Dictionary; dark?: boolean }) {
  const [state, action, pending] = useActionState(submitNewsletter, emptyPublicState);
  const [startedAt] = useState(() => Date.now());
  const form = dict.forms;
  if (state.ok) {
    return (
      <div className={dark ? "rounded-3xl bg-white/10 p-6 text-white ring-1 ring-white/15" : "rounded-3xl bg-white p-6 ring-1 ring-line"} role="status">
        <h3 className="font-display text-2xl font-semibold">{form.subscribed}</h3>
        {state.message && state.message !== form.subscribed ? <p className="mt-2 leading-relaxed opacity-80">{state.message}</p> : null}
        {state.unsubscribeUrl ? (
          <p className="mt-4 break-all text-sm">
            {form.subscribedDetail} <a className="font-semibold underline" href={state.unsubscribeUrl}>{state.unsubscribeUrl}</a>
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <form action={action} className={dark ? "relative grid gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 md:grid-cols-2" : "relative grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line md:grid-cols-2"}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={startedAt} />
      <p className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></p>
      {state.message ? <p className={`md:col-span-2 text-sm ${dark ? "text-red-200" : "text-danger"}`} role="alert">{state.message}</p> : null}
      <label className="text-sm font-semibold">{form.nameOptional}<input className={dark ? "field-dark" : "field"} name="name" /></label>
      <label className="text-sm font-semibold">{dict.contact.email}<input className={dark ? "field-dark" : "field"} name="email" type="email" aria-invalid={state.fieldErrors.email ? true : undefined} />{state.fieldErrors.email ? <span className="mt-1 block text-sm text-red-200">{state.fieldErrors.email}</span> : null}</label>
      <label className="text-sm font-semibold">{form.cityOptional}<input className={dark ? "field-dark" : "field"} name="city" /></label>
      <label className="text-sm font-semibold">{form.whatsapp}
        <input className={dark ? "field-dark" : "field"} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={state.fieldErrors.whatsapp ? true : undefined} />
        {state.fieldErrors.whatsapp ? <span className={`mt-1 block text-sm ${dark ? "text-red-200" : "text-danger"}`}>{state.fieldErrors.whatsapp}</span> : null}
      </label>
      <InterestField
        dark={dark}
        label={form.interest}
        error={state.fieldErrors.interest}
        options={[
          { value: "ride", label: form.interestRide },
          { value: "drive", label: form.interestDrive },
          { value: "both", label: form.interestBoth },
        ]}
      />
      <label className="flex items-start gap-3 text-sm md:col-span-2">
        <input className="mt-1 h-5 w-5" type="checkbox" name="consent" />
        <span>{form.consent}{state.fieldErrors.consent ? <span className={`mt-1 block ${dark ? "text-red-200" : "text-danger"}`}>{state.fieldErrors.consent}</span> : null}</span>
      </label>
      <button disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-pin px-5 font-semibold text-navy-950 disabled:opacity-60 md:col-span-2" type="submit">{pending ? "…" : form.subscribe}</button>
    </form>
  );
}

export function UnsubscribeForm({ locale, token, label }: { locale: Locale; token: string; label: string }) {
  const [state, action, pending] = useActionState(confirmUnsubscribe, emptyPublicState);
  if (state.ok) return <p className="rounded-2xl bg-white px-4 py-3 font-semibold text-ink" role="status">{state.message}</p>;
  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="token" value={token} />
      {state.message ? <p className="mb-3 text-sm text-red-200" role="alert">{state.message}</p> : null}
      <button className="inline-flex min-h-12 items-center rounded-full bg-white px-5 font-semibold text-navy-950" disabled={pending} type="submit">{label}</button>
    </form>
  );
}

function InterestField({
  label,
  options,
  dark,
  error,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  dark: boolean;
  error?: string;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function choose(index: number) {
    const next = options[index];
    if (!next) return;
    setValue(next.value);
    setActive(index);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative text-sm font-semibold md:col-span-2">
      <span id={`${listId}-label`}>{label}</span>
      <input type="hidden" name="interest" value={value} />
      <button
        type="button"
        className={`${dark ? "field-dark" : "field"} flex items-center justify-between gap-3 text-left`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listId}-label`}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActive((current) => {
              const step = event.key === "ArrowDown" ? 1 : -1;
              return (current + step + options.length) % options.length;
            });
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (open) choose(active);
            else setOpen(true);
          }
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <span className={selected ? "" : dark ? "text-white/70" : "text-slate"}>{selected?.label || label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul id={listId} role="listbox" aria-labelledby={`${listId}-label`} className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white py-1 text-navy-950 shadow-xl ring-1 ring-black/10">
          {options.map((item, index) => (
            <li key={item.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === item.value}
                className={`block w-full px-4 py-3 text-left text-sm font-semibold text-navy-950 ${index === active ? "bg-blue-50" : "bg-white"} hover:bg-blue-600 hover:text-white`}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <span className={`mt-1 block text-sm font-normal ${dark ? "text-red-200" : "text-danger"}`}>{error}</span> : null}
    </div>
  );
}

function Label({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input className="field" name={name} type={type} aria-invalid={error ? true : undefined} />
      {error ? <span className="mt-1 block text-danger">{error}</span> : null}
    </label>
  );
}
