"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/server/admin";

const initial: AuthState = { message: "" };

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="mt-6 grid gap-3">
      <input type="hidden" name="next" value={next} />
      <label className="text-sm font-semibold">Correo
        <input className="field" name="email" type="email" autoComplete="username" required />
      </label>
      <label className="text-sm font-semibold">Contraseña
        <input className="field" name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.totpRequired ? (
        <label className="text-sm font-semibold">Código
          <input className="field" name="code" inputMode="numeric" autoComplete="one-time-code" />
        </label>
      ) : null}
      {state.message ? <p className="text-sm text-danger" role="alert">{state.message}</p> : null}
      <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white" disabled={pending} type="submit">{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
