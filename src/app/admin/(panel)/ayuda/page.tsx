import { adminCopy } from "@/content/admin-ui";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/db";
import { deleteArticle, deleteFaq, saveArticle, saveFaq } from "@/server/admin";

export default async function Page({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const query = await searchParams;
  const ui = adminCopy(await getAdminLocale());
  const copy = ui.help;
  const common = ui.common;
  const [faqs, articles] = await Promise.all([
    prisma.faqItem.findMany({ orderBy: [{ locale: "asc" }, { audience: "asc" }, { sortOrder: "asc" }] }),
    prisma.helpArticle.findMany({ orderBy: [{ locale: "asc" }, { sortOrder: "asc" }] }),
  ]);
  const notice = query.aviso === "guardado" ? common.saved : query.aviso === "incompleto" ? copy.incomplete : "";
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">{copy.title}</h1>
      {notice ? <p className="text-sm text-slate">{notice}</p> : null}
      <form action={saveFaq} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">{copy.newQuestion}</h2>
        <select className="field" name="locale" defaultValue="es" aria-label={copy.title}><option value="es">Español</option><option value="en">English</option></select>
        <select className="field" name="audience" defaultValue="passenger" aria-label={copy.passengers}><option value="passenger">{copy.passengers}</option><option value="driver">{copy.drivers}</option></select>
        <input className="field md:col-span-2" name="question" placeholder={copy.question} />
        <textarea className="field min-h-24 md:col-span-2" name="answer" placeholder={copy.answer} />
        <input className="field" name="sortOrder" type="number" defaultValue={faqs.length + 1} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> {copy.published}</label>
        <button className="md:col-span-2 min-h-12 rounded-full bg-blue-600 font-semibold text-white">{copy.addQuestion}</button>
      </form>
      {faqs.map((faq) => (
        <form key={faq.id} action={saveFaq} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
          <input type="hidden" name="id" value={faq.id} />
          <div className="grid gap-2 md:grid-cols-3">
            <select className="field" name="locale" defaultValue={faq.locale}><option value="es">Español</option><option value="en">English</option></select>
            <select className="field" name="audience" defaultValue={faq.audience}><option value="passenger">{copy.passengers}</option><option value="driver">{copy.drivers}</option></select>
            <input className="field" name="sortOrder" type="number" defaultValue={faq.sortOrder} />
          </div>
          <input className="field" name="question" defaultValue={faq.question} />
          <textarea className="field min-h-24" name="answer" defaultValue={faq.answer} />
          <label className="flex gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={faq.published} /> {copy.published}</label>
          <div className="flex gap-2">
            <button className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">{common.save}</button>
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-danger" formAction={deleteFaq}>{common.delete}</button>
          </div>
        </form>
      ))}
      <form action={saveArticle} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
        <h2 className="font-semibold">{copy.newArticle}</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <select className="field" name="locale" defaultValue="es"><option value="es">Español</option><option value="en">English</option></select>
          <select className="field" name="audience" defaultValue="all"><option value="all">{copy.everyone}</option><option value="passenger">{copy.passengers}</option><option value="driver">{copy.drivers}</option></select>
          <input className="field" name="slug" placeholder={copy.slug} />
        </div>
        <input className="field" name="title" placeholder={copy.articleTitle} />
        <input className="field" name="summary" placeholder={copy.summary} />
        <textarea className="field min-h-32" name="body" placeholder={copy.body} />
        <label className="flex gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> {copy.articlePublished}</label>
        <button className="min-h-12 rounded-full bg-blue-600 font-semibold text-white">{copy.addArticle}</button>
      </form>
      {articles.map((article) => (
        <form key={article.id} action={saveArticle} className="grid gap-2 rounded-3xl bg-white p-5 ring-1 ring-line">
          <input type="hidden" name="id" value={article.id} />
          <div className="grid gap-2 md:grid-cols-3">
            <select className="field" name="locale" defaultValue={article.locale}><option value="es">Español</option><option value="en">English</option></select>
            <select className="field" name="audience" defaultValue={article.audience}><option value="all">{copy.everyone}</option><option value="passenger">{copy.passengers}</option><option value="driver">{copy.drivers}</option></select>
            <input className="field" name="slug" defaultValue={article.slug} />
          </div>
          <input className="field" name="title" defaultValue={article.title} />
          <input className="field" name="summary" defaultValue={article.summary} />
          <textarea className="field min-h-32" name="body" defaultValue={article.body} />
          <input type="hidden" name="sortOrder" value={article.sortOrder} />
          <label className="flex gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={article.published} /> {copy.articlePublished}</label>
          <div className="flex gap-2">
            <button className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">{common.save}</button>
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-danger" formAction={deleteArticle}>{common.delete}</button>
          </div>
        </form>
      ))}
    </div>
  );
}
