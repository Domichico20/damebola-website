import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { adminCopy } from "@/content/admin-ui";
import { adminDateLocale, getAdminLocale } from "@/lib/admin-locale";
import { updateApplication } from "@/server/admin";

const statusKeys = ["pending", "under_review", "approved", "rejected", "more_info"] as const;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const locale = await getAdminLocale();
  const copy = adminCopy(locale);
  const dateLocale = adminDateLocale(locale);
  const application = await prisma.driverApplication.findUnique({
    where: { id },
    include: { documents: true, notes: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!application) notFound();
  const vehicle = `${application.vehicleType === "car" ? copy.common.car : copy.common.motorcycle} · ${application.vehicleMake} ${application.vehicleModel} ${application.vehicleYear}`;
  const fields = [
    [copy.application.name, `${application.firstName} ${application.lastName}`],
    [copy.application.phone, application.phone],
    ["WhatsApp", application.whatsapp || "—"],
    [copy.application.email, application.email],
    [copy.application.city, `${application.city}, ${application.province}`],
    [copy.application.vehicle, vehicle],
    [copy.application.license, `${application.licenseNumber}${application.licenseExpiry ? ` · ${copy.application.expires} ${application.licenseExpiry}` : ""}`],
    [copy.application.reference, application.id.slice(-8).toUpperCase()],
    [copy.application.mailStatus, application.emailStatus],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <h1 className="font-display text-3xl font-semibold">{application.firstName} {application.lastName}</h1>
        {query.aviso === "guardado" ? <p className="mt-2 text-sm text-success">{copy.common.saved}</p> : null}
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          {fields.map(([label, value]) => <div key={label}><dt className="text-slate">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
        </dl>
        <h2 className="mt-6 font-semibold">{copy.application.documents}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {application.documents.length === 0 ? <li className="text-slate">{copy.application.noDocuments}</li> : application.documents.map((doc) => (
            <li key={doc.id}><a className="font-semibold text-blue-700" href={`/api/admin/documents/${doc.id}`}>{doc.originalName}</a> · {doc.kind} · {Math.ceil(doc.size / 1024)} KB</li>
          ))}
        </ul>
        <h2 className="mt-6 font-semibold">{copy.application.notes}</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {application.notes.map((note) => (
            <li key={note.id} className="rounded-2xl bg-paper p-3">
              <p className="whitespace-pre-line">{note.body}</p>
              <p className="mt-1 text-xs text-slate">{note.author.name} · {note.createdAt.toLocaleString(dateLocale)} {note.sentToUser ? `· ${copy.application.sent}` : ""}</p>
            </li>
          ))}
        </ul>
      </section>
      <form action={updateApplication} className="h-fit rounded-3xl bg-white p-5 ring-1 ring-line">
        <input type="hidden" name="id" value={application.id} />
        <h2 className="font-semibold">{copy.common.status}</h2>
        <p className="mt-1 text-sm text-slate">{copy.application.statusHelp}</p>
        <select className="field" name="status" defaultValue={application.status} aria-label={copy.common.status}>
          {statusKeys.map((value) => <option key={value} value={value}>{value === "more_info" ? copy.status.more_info_long : copy.status[value]}</option>)}
        </select>
        <label className="mt-3 block text-sm font-semibold">{copy.application.internalNote}
          <textarea className="field min-h-24" name="note" />
        </label>
        <label className="mt-3 block text-sm font-semibold">{copy.application.applicantMessage}
          <textarea className="field min-h-24" name="applicantMessage" placeholder={copy.application.applicantPlaceholder} />
        </label>
        <label className="mt-3 flex items-start gap-2 text-sm"><input type="checkbox" name="notify" /> {copy.application.notify}</label>
        <button className="mt-4 min-h-12 rounded-full bg-blue-600 px-5 font-semibold text-white">{copy.common.save}</button>
      </form>
    </div>
  );
}
