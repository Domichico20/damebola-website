"use client";

import { useActionState } from "react";
import { requestReset, resetPassword, type AuthState } from "@/server/admin";

const initial: AuthState = { message: "" };

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestReset, initial);
  return (
    <form action={action} className="grid gap-3">
      <label className="text-sm font-semibold">Correo<input className="field" type="email" name="email" required /></label>
      {state.message ? <p className="text-sm" role="status">{state.message}</p> : null}
      <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>Enviar enlace</button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="token" value={token} />
      <label className="text-sm font-semibold">Nueva contraseña<input className="field" type="password" name="password" required /></label>
      <label className="text-sm font-semibold">Confirmar<input className="field" type="password" name="confirm" required /></label>
      {state.message ? <p className="text-sm text-danger" role="alert">{state.message}</p> : null}
      <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>Guardar contraseña</button>
    </form>
  );
}
