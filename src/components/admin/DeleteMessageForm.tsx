"use client";

import { deleteInquiry } from "@/server/admin";

export function DeleteMessageForm({ id, label, confirm }: { id: string; label: string; confirm: string }) {
  return (
    <form
      action={deleteInquiry}
      className="rounded-3xl bg-white px-5 py-4 ring-1 ring-line"
      onSubmit={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="min-h-12 rounded-full px-5 font-semibold text-danger" type="submit">{label}</button>
    </form>
  );
}
