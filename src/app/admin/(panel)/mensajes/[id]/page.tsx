import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateInquiry } from "@/server/admin";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.contactInquiry.findUnique({
    where: { id },
    include: { notes: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry) notFound();
  const query = await searchParams;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <h1 className="font-display text-3xl font-semibold">{inquiry.fullName}</h1>
        {query.aviso === "guardado" ? <p className="mt-2 text-sm text-success">Cambios guardados.</p> : null}
        <p className="mt-2 text-sm text-slate">{inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ""} · {inquiry.category}</p>
        <p className="mt-4 whitespace-pre-line leading-relaxed">{inquiry.message}</p>
        <h2 className="mt-6 font-semibold">Historial</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {inquiry.notes.map((note) => (
            <li key={note.id} className="rounded-2xl bg-paper p-3">
              <p className="whitespace-pre-line">{note.body}</p>
              <p className="mt-1 text-xs text-slate">{note.author.name} · {note.sentToUser ? "enviado al correo" : "nota interna"}</p>
            </li>
          ))}
        </ul>
      </article>
      <form action={updateInquiry} className="h-fit rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="id" value={inquiry.id} />
        <label className="text-sm font-semibold">Estado
          <select className="field" name="status" defaultValue={inquiry.status}>
            <option value="open">Abierto</option>
            <option value="pending">Pendiente</option>
            <option value="resolved">Resuelto</option>
          </select>
        </label>
        <label className="mt-3 block text-sm font-semibold">Nota o respuesta
          <textarea className="field min-h-32" name="note" />
        </label>
        <label className="mt-3 flex gap-2 text-sm"><input type="checkbox" name="send" /> Enviar este texto al correo de la persona</label>
        <button className="mt-4 min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">Guardar</button>
      </form>
    </div>
  );
}
