import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateApplication } from "@/server/admin";

const labels: Record<string, string> = {
  pending: "Pendiente",
  under_review: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  more_info: "Se requiere más información",
};

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const application = await prisma.driverApplication.findUnique({
    where: { id },
    include: { documents: true, notes: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!application) notFound();
  const fields = [
    ["Nombre", `${application.firstName} ${application.lastName}`],
    ["Teléfono", application.phone],
    ["WhatsApp", application.whatsapp || "—"],
    ["Correo", application.email],
    ["Ciudad", `${application.city}, ${application.province}`],
    ["Vehículo", `${application.vehicleType === "car" ? "Carro" : "Motocicleta"} · ${application.vehicleMake} ${application.vehicleModel} ${application.vehicleYear}`],
    ["Licencia", `${application.licenseNumber}${application.licenseExpiry ? ` · vence ${application.licenseExpiry}` : ""}`],
    ["Referencia", application.id.slice(-8).toUpperCase()],
    ["Correo al solicitante", application.emailStatus],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <h1 className="font-display text-3xl font-semibold">{application.firstName} {application.lastName}</h1>
        {query.aviso === "guardado" ? <p className="mt-2 text-sm text-success">Cambios guardados.</p> : null}
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          {fields.map(([label, value]) => <div key={label}><dt className="text-slate">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
        </dl>
        <h2 className="mt-6 font-semibold">Documentos privados</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {application.documents.length === 0 ? <li className="text-slate">No adjuntó documentos. Subir un archivo no significa que esté verificado.</li> : application.documents.map((doc) => (
            <li key={doc.id}><a className="font-semibold text-blue-700" href={`/api/admin/documents/${doc.id}`}>{doc.originalName}</a> · {doc.kind} · {Math.ceil(doc.size / 1024)} KB</li>
          ))}
        </ul>
        <h2 className="mt-6 font-semibold">Notas internas</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {application.notes.map((note) => (
            <li key={note.id} className="rounded-2xl bg-paper p-3">
              <p className="whitespace-pre-line">{note.body}</p>
              <p className="mt-1 text-xs text-slate">{note.author.name} · {note.createdAt.toLocaleString("es-DO")} {note.sentToUser ? "· enviado" : ""}</p>
            </li>
          ))}
        </ul>
      </section>
      <form action={updateApplication} className="h-fit rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="id" value={application.id} />
        <h2 className="font-semibold">Estado</h2>
        <p className="mt-1 text-sm text-slate">Aprobar aquí no crea una cuenta de conductor en la app.</p>
        <select className="field" name="status" defaultValue={application.status}>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="mt-3 block text-sm font-semibold">Nota interna
          <textarea className="field min-h-24" name="note" />
        </label>
        <label className="mt-3 block text-sm font-semibold">Mensaje para el solicitante
          <textarea className="field min-h-24" name="applicantMessage" placeholder="Si lo dejas vacío y marcas notificar, se usa un texto estándar." />
        </label>
        <label className="mt-3 flex items-start gap-2 text-sm"><input type="checkbox" name="notify" /> Notificar por correo si el servidor de correo está configurado</label>
        <button className="mt-4 min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">Guardar</button>
      </form>
    </div>
  );
}
