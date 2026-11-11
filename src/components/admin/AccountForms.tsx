"use client";

import { useActionState } from "react";
import { changePassword, confirmTotp, disableOwnTotp, type AuthState } from "@/server/admin";

const initial: AuthState = { message: "" };

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  return (
    <form action={action} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
      <h2 className="font-semibold">Contraseña</h2>
      <input className="field" type="password" name="current" placeholder="Actual" autoComplete="current-password" />
      <input className="field" type="password" name="password" placeholder="Nueva" autoComplete="new-password" />
      <input className="field" type="password" name="confirm" placeholder="Confirmar" autoComplete="new-password" />
      {state.message ? <p className="text-sm" role="status">{state.message}</p> : null}
      <button className="min-h-11 rounded-full bg-navy-900 font-semibold text-white" disabled={pending}>Actualizar contraseña</button>
    </form>
  );
}

export function TotpConfirmForm() {
  const [state, action, pending] = useActionState(confirmTotp, initial);
  return (
    <form action={action} className="mt-3 grid gap-2">
      <input className="field" name="code" inputMode="numeric" placeholder="Código de 6 dígitos" />
      <button className="min-h-11 rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>Confirmar doble factor</button>
      {state.message ? <p className="text-sm">{state.message}</p> : null}
      {state.codes ? <ul className="rounded-2xl bg-amber-50 p-3 font-mono text-sm">{state.codes.map((code) => <li key={code}>{code}</li>)}</ul> : null}
    </form>
  );
}

export function TotpDisableForm() {
  const [state, action, pending] = useActionState(disableOwnTotp, initial);
  return (
    <form action={action} className="grid gap-2">
      <input className="field" type="password" name="password" placeholder="Contraseña para desactivar" />
      {state.message ? <p className="text-sm">{state.message}</p> : null}
      <button className="min-h-11 rounded-full px-4 text-sm font-semibold text-danger" disabled={pending}>Desactivar doble factor</button>
    </form>
  );
}
