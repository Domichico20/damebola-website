import { notFound } from "next/navigation";
import { DriverForm } from "@/components/forms/DriverForm";
import { Button, Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { provinces } from "@/lib/provinces";
import { pick } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/conduce", loaded.dict.drive.title, loaded.dict.drive.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale, content } = loaded;
  const requirements = pick(content, "driver_requirements", dict.drive.requirements);
  return (
    <>
      <PageHero kicker={dict.drive.kicker} title={dict.drive.title} description={dict.drive.description}>
        <Button href="#preinscripcion" variant="pin">{dict.drive.formTitle}</Button>
      </PageHero>
      <Container className="py-14">
        <h2 className="font-display text-3xl font-semibold">{dict.drive.benefitsTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {dict.drive.benefits.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-5 ring-1 ring-line">
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
      <section id="preinscripcion" className="bg-navy-950 py-14 text-white">
        <Container className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold">{dict.drive.formTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/75">{dict.drive.formIntro}</p>
            <h3 className="mt-8 font-display text-2xl font-semibold">{dict.drive.requirementsTitle}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">{requirements}</p>
            <p className="mt-6 text-sm"><a className="underline" href={localize(locale, "/legal/terminos-conductores")}>{dict.footer.driverTerms}</a></p>
          </div>
          <DriverForm
            locale={locale}
            copy={dict.drive}
            errors={dict.forms.errors}
            provinces={provinces}
            requirements={requirements}
            privacyHref={localize(locale, "/legal/privacidad")}
            privacyLabel={dict.footer.privacy}
          />
        </Container>
      </section>
    </>
  );
}
