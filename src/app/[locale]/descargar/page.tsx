import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { StoreBadge } from "@/components/brand";
import { NewsletterForm } from "@/components/forms/SimpleForms";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { isHttpUrl } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

async function qr(url: string) {
  if (!isHttpUrl(url)) return "";
  return QRCode.toDataURL(url, { margin: 1, width: 240 });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) return {};
  return pageMetadata(loaded.locale, "/descargar", loaded.dict.download.title, loaded.dict.download.description);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const loaded = await loadPublic((await params).locale);
  if (!loaded) notFound();
  const { dict, locale, settings } = loaded;
  const cards = [
    { group: dict.download.passengers, title: dict.download.iphone, subtitle: "App Store", href: settings.appStorePassenger },
    { group: dict.download.passengers, title: dict.download.android, subtitle: "Google Play", href: settings.playStorePassenger, store: "google" as const },
    { group: dict.download.drivers, title: dict.download.driverIphone, subtitle: "App Store", href: settings.appStoreDriver },
    { group: dict.download.drivers, title: dict.download.driverAndroid, subtitle: "Google Play", href: settings.playStoreDriver, store: "google" as const },
  ];
  const qrs = await Promise.all(cards.map((card) => qr(card.href)));
  return (
    <>
      <PageHero kicker={dict.download.kicker} title={dict.download.title} description={dict.download.description} />
      <Container className="grid gap-4 py-14 md:grid-cols-2">
        {cards.map((card, index) => {
          const href = isHttpUrl(card.href) ? card.href : "";
          return (
            <article key={card.title} className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{card.group}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{card.title}</h2>
              <div className="mt-5">
                <StoreBadge store={card.store || "apple"} title={card.title} subtitle={card.subtitle} href={href || undefined} soon={dict.download.unavailable} />
              </div>
              <p className="mt-4 text-sm text-slate">{href ? dict.download.qr : dict.download.unavailable}</p>
              {qrs[index] ? (
                <img src={qrs[index]} alt={`${dict.download.qr}: ${card.title}`} width={160} height={160} className="mt-4 rounded-2xl bg-white" />
              ) : <p className="mt-3 text-sm text-slate">{dict.download.qrHint}</p>}
            </article>
          );
        })}
      </Container>
      <section className="bg-navy-950 py-14 text-white">
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-semibold">{dict.home.earlyTitle}</h2>
            <p className="mt-3 text-white/75">{dict.home.earlyDescription}</p>
          </div>
          <NewsletterForm locale={locale} dict={dict} dark />
        </Container>
      </section>
    </>
  );
}
