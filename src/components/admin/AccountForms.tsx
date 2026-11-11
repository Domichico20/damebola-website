"use client";

import { useActionState } from "react";
import type { AdminCopy } from "@/content/admin-ui";
import { changePassword, confirmTotp, disableOwnTotp, type AuthState } from "@/server/admin";

const initial: AuthState = { message: "" };

export function PasswordForm({ copy }: { copy: AdminCopy["account"] }) {
  const [state, action, pending] = useActionState(changePassword, initial);
  return (
    <form action={action} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
      <h2 className="font-semibold">{copy.password}</h2>
      <input className="field" type="password" name="current" placeholder={copy.current} autoComplete="current-password" />
      <input className="field" type="password" name="password" placeholder={copy.next} autoComplete="new-password" />
      <input className="field" type="password" name="confirm" placeholder={copy.confirm} autoComplete="new-password" />
      {state.message ? <p className="text-sm" role="status">{state.message}</p> : null}
      <button className="min-h-11 rounded-full bg-navy-900 font-semibold text-white" disabled={pending}>{copy.update}</button>
    </form>
  );
}

export function TotpConfirmForm({ copy }: { copy: AdminCopy["account"] }) {
  const [state, action, pending] = useActionState(confirmTotp, initial);
  return (
    <form action={action} className="mt-3 grid gap-2">
      <input className="field" name="code" inputMode="numeric" placeholder={copy.code} />
      <button className="min-h-11 rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>{copy.confirmTotp}</button>
      {state.message ? <p className="text-sm">{state.message}</p> : null}
      {state.codes ? <ul className="rounded-2xl bg-amber-50 p-3 font-mono text-sm">{state.codes.map((code) => <li key={code}>{code}</li>)}</ul> : null}
    </form>
  );
}

export function TotpDisableForm({ copy }: { copy: AdminCopy["account"] }) {
  const [state, action, pending] = useActionState(disableOwnTotp, initial);
  return (
    <form action={action} className="grid gap-2">
      <input className="field" type="password" name="password" placeholder={copy.disablePassword} />
      {state.message ? <p className="text-sm">{state.message}</p> : null}
      <button className="min-h-11 rounded-full px-4 text-sm font-semibold text-danger" disabled={pending}>{copy.disable}</button>
    </form>
  );
}
