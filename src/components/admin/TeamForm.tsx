"use client";

import { useActionState } from "react";
import { createStaff, type AuthState } from "@/server/admin";

export function TeamForm() {
  const [state, action, pending] = useActionState(createStaff, { message: "" } satisfies AuthState);
  return (
    <form action={action} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line md:grid-cols-2">
      <h2 className="md:col-span-2 font-semibold">Nueva persona</h2>
      <input className="field" name="name" placeholder="Nombre" required />
      <input className="field" name="email" type="email" placeholder="Correo" required />
      <select className="field" name="role" defaultValue="support">
        <option value="admin">Administración</option>
        <option value="support">Soporte</option>
      </select>
      <button className="rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>Crear cuenta</button>
      {state.message ? <p className="md:col-span-2 text-sm" role="status">{state.message}</p> : null}
      {state.password ? <p className="md:col-span-2 rounded-2xl bg-amber-50 p-3 text-sm">Contraseña temporal: <strong>{state.password}</strong></p> : null}
    </form>
  );
}
