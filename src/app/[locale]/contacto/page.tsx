import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/SimpleForms";
import { CompanyInfo } from "@/components/site/CompanyInfo";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { isHttpUrl, whatsappLink } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/contacto", loaded.dict.contact.title, loaded.dict.contact.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale, settings } = loaded;
  const whatsapp = whatsappLink(settings.whatsappNumber);
  const socials = [
    ["Instagram", settings.socialInstagram],
    ["Facebook", settings.socialFacebook],
    ["X", settings.socialX],
    ["TikTok", settings.socialTiktok],
    ["YouTube", settings.socialYoutube],
  ].filter((item): item is [string, string] => isHttpUrl(item[1]));
  return (
    <>
      <PageHero kicker={dict.contact.kicker} title={dict.contact.title} description={dict.contact.description} />
      <Container className="grid gap-8 py-14 lg:grid-cols-[1fr_.8fr]">
        <ContactForm locale={locale} copy={dict.contact} categories={dict.contact.categories} />
        <aside className="space-y-4">
          <div className="rounded-3xl bg-navy-950 p-6 text-white">
            <h2 className="font-display text-2xl font-semibold">{dict.contact.email}</h2>
            <a className="mt-2 inline-flex text-cyan-300" href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{dict.contact.emailNote}</p>
            {whatsapp ? (
              <a className="mt-5 inline-flex min-h-12 items-center rounded-full bg-pin px-5 font-semibold text-navy-950" href={whatsapp} rel="noopener noreferrer">{dict.contact.whatsapp}</a>
            ) : null}
          </div>
          <CompanyInfo copy={dict.companyInfo} />
          {socials.length || settings.companyAddress ? (
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
              {socials.length ? (
                <>
                  <h2 className="font-semibold">{dict.contact.social}</h2>
                  <ul className="mt-3 space-y-2">
                    {socials.map(([label, href]) => <li key={href}><a className="font-semibold text-blue-700" href={href} rel="noopener noreferrer">{label}</a></li>)}
                  </ul>
                </>
              ) : null}
              {settings.companyAddress ? <p className="mt-4 text-sm text-slate">{settings.companyAddress}</p> : null}
            </div>
          ) : null}
        </aside>
      </Container>
    </>
  );
}
