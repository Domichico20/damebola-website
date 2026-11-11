import { notFound } from "next/navigation";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { prisma } from "@/lib/db";
import { adminCopy } from "@/content/admin-ui";
import { getSession } from "@/lib/auth";
import { formatAdminDateTime, getAdminLocale } from "@/lib/admin-locale";
import { deleteInquiry, updateInquiry } from "@/server/admin";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.contactInquiry.findUnique({
    where: { id },
    include: { notes: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry) notFound();
  const query = await searchParams;
  const session = await getSession();
  const canDelete = session?.role === "owner" || session?.role === "admin";
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const category = copy.categories[inquiry.category as keyof typeof copy.categories] || inquiry.category;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <h1 className="font-display text-3xl font-semibold">{inquiry.fullName}</h1>
        {query.aviso === "guardado" ? <p className="mt-2 text-sm text-success">{copy.common.saved}</p> : null}
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-slate">{copy.common.email}</dt><dd className="font-semibold">{inquiry.email}</dd></div>
          <div><dt className="text-slate">{copy.common.phone}</dt><dd className="font-semibold">{inquiry.phone || "—"}</dd></div>
          <div><dt className="text-slate">{copy.messages.category}</dt><dd className="font-semibold">{category}</dd></div>
          <div><dt className="text-slate">{copy.common.when}</dt><dd className="font-semibold">{formatAdminDateTime(inquiry.createdAt, locale)}</dd></div>
          <div><dt className="text-slate">{copy.common.status}</dt><dd className="font-semibold">{copy.status[inquiry.status as keyof typeof copy.status] || inquiry.status}</dd></div>
        </dl>
        <h2 className="mt-4 font-semibold">{copy.messages.message}</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{inquiry.message}</p>
        <h2 className="mt-6 font-semibold">{copy.messages.history}</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {inquiry.notes.map((note) => (
            <li key={note.id} className="rounded-2xl bg-paper p-3">
              <p className="whitespace-pre-line">{note.body}</p>
              <p className="mt-1 text-xs text-slate">{note.author.name} · {note.sentToUser ? copy.messages.sent : copy.messages.internal}</p>
            </li>
          ))}
        </ul>
      </article>
      <div className="h-fit space-y-3">
      <form action={updateInquiry} className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="id" value={inquiry.id} />
        <label className="text-sm font-semibold">{copy.common.status}
          <select className="field" name="status" defaultValue={inquiry.status}>
            <option value="open">{copy.status.open}</option>
            <option value="pending">{copy.status.pending}</option>
            <option value="resolved">{copy.status.resolved}</option>
          </select>
        </label>
        <label className="mt-3 block text-sm font-semibold">{copy.messages.note}
          <textarea className="field min-h-32" name="note" />
        </label>
        <label className="mt-3 flex gap-2 text-sm"><input type="checkbox" name="send" /> {copy.messages.send}</label>
        <button className="mt-4 min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">{copy.common.save}</button>
      </form>
      {canDelete ? <ConfirmDeleteForm action={deleteInquiry} id={inquiry.id} label={copy.messages.delete} confirm={copy.messages.deleteConfirm} /> : null}
      </div>
    </div>
  );
}
