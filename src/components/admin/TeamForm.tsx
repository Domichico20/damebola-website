"use client";

import { useActionState } from "react";
import type { AdminCopy } from "@/content/admin-ui";
import { createStaff, type AuthState } from "@/server/admin";

export function TeamForm({ copy }: { copy: AdminCopy["team"] }) {
  const [state, action, pending] = useActionState(createStaff, { message: "" } satisfies AuthState);
  return (
    <form action={action} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line md:grid-cols-2">
      <h2 className="md:col-span-2 font-semibold">{copy.newPerson}</h2>
      <input className="field" name="name" placeholder={copy.name} required />
      <input className="field" name="email" type="email" placeholder={copy.email} required />
      <select className="field" name="role" defaultValue="support" aria-label={copy.newPerson}>
        <option value="admin">{copy.admin}</option>
        <option value="support">{copy.support}</option>
      </select>
      <button className="rounded-full bg-blue-600 font-semibold text-white" disabled={pending}>{copy.create}</button>
      {state.message ? <p className="md:col-span-2 text-sm" role="status">{state.message}</p> : null}
      {state.password ? <p className="md:col-span-2 rounded-2xl bg-amber-50 p-3 text-sm">{copy.tempPassword}: <strong>{state.password}</strong></p> : null}
    </form>
  );
}
