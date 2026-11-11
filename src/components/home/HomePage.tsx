import Link from "next/link";
import { Bike, Car, HandCoins, MapPin, Navigation, ShieldCheck, Smartphone, UserRound, MessagesSquare } from "lucide-react";
import type { Dictionary } from "@/content/types";
import { PhoneMock, SantiagoArt, SantoDomingoArt } from "@/components/brand";
import { NewsletterForm } from "@/components/forms/SimpleForms";
import { FarePlayground } from "@/components/FarePlayground";
import { Button, Container, StatusPill } from "@/components/ui";
import { localize, type Locale } from "@/lib/routes";
import { pick } from "@/lib/settings";

const stepIcons = [Smartphone, MapPin, HandCoins, MessagesSquare, UserRound, Navigation];

export function HomePage({
  locale,
  dict,
  content,
  promotionEnabled,
  safety,
}: {
  locale: Locale;
  dict: Dictionary;
  content: Record<string, string>;
  promotionEnabled: boolean;
  safety: Array<{ id: string; status: "live" | "soon" | "partial"; title: string }>;
}) {
  const home = dict.home;
  const title = pick(content, "hero_title", home.heroTitle);
  const accent = pick(content, "hero_accent", home.heroAccent);
  const description = pick(content, "hero_description", home.heroDescription);
  const earlyTitle = pick(content, "early_title", home.earlyTitle);
  const earlyDescription = pick(content, "early_description", home.earlyDescription);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute inset-0 map-grid" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-pin" />
              {dict.common.prelaunch} · {dict.common.country}
            </p>
            <p className="mt-5 text-sm font-semibold text-white/70">{home.kicker}</p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              {title}
              <span className="mt-1 block text-gradient">{accent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={localize(locale, "/descargar")}>{home.download}</Button>
              <Button href={localize(locale, "/conduce")} variant="pin">{home.drive}</Button>
              <Button href={localize(locale, "/como-funciona")} variant="secondary">{home.how}</Button>
            </div>
          </div>
          <PhoneMock copy={dict.ride} />
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-12">
          <p className="font-display text-2xl font-semibold md:text-3xl">{home.phrase}</p>
          <p className="mt-2 text-slate">{home.phraseGloss}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {home.promises.map((item) => (
              <article key={item.title} className="rounded-3xl bg-paper p-5 ring-1 ring-line">
                <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
              </article>
            ))}
          </div>
          {promotionEnabled ? (
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy-900 p-6 text-white md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{pick(content, "promotion_kicker", home.promoKicker)}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">{pick(content, "promotion_title", home.promoTitle)}</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/75">{pick(content, "promotion_body", home.promoBody)}</p>
              </div>
              <Button href={localize(locale, pick(content, "promotion_href", home.promoHref))} variant="pin">{home.promoCta}</Button>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 md:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{dict.how.kicker}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">{home.howTitle}</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate">{home.howBody}</p>
            </div>
            <Button href={localize(locale, "/descargar")}>{home.howCta}</Button>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dict.how.steps.map((step, index) => {
              const Icon = stepIcons[index] ?? Smartphone;
              const number = String(index + 1).padStart(2, "0");
              return (
                <li key={step.title} className="card-hover rounded-[1.75rem] bg-white p-6 shadow-[0_24px_50px_-32px_rgba(7,18,39,0.55)] ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-950 text-white shadow-lg shadow-navy-950/20"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="text-xs font-bold tracking-[0.18em] text-blue-700">{number}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
                  <span className="mt-6 block h-1 w-12 rounded-full bg-pin" aria-hidden="true" />
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="bg-navy-950 text-white">
        <Container className="grid gap-4 py-16 md:grid-cols-2 md:py-20">
          <article className="rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
            <Car className="h-8 w-8 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-semibold">{home.rideTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/75">{home.rideBody}</p>
            <Link className="mt-5 inline-flex font-semibold text-cyan-300" href={localize(locale, "/viaja")}>{dict.common.learnMore}</Link>
          </article>
          <article className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-navy-800 p-6">
            <Bike className="h-8 w-8" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-semibold">{home.driveTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/80">{home.driveBody}</p>
            <Link className="mt-5 inline-flex font-semibold" href={localize(locale, "/conduce")}>{home.promoCta}</Link>
          </article>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid items-center gap-8 py-16 lg:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{home.fareKicker}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">{home.fareTitle}</h2>
            <p className="mt-3 text-slate">{home.fareBody}</p>
            <div className="mt-6"><Button href={localize(locale, "/tarifas")} variant="dark">{home.fareCta}</Button></div>
          </div>
          <FarePlayground copy={dict.fares} />
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{home.safetyKicker}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">{home.safetyTitle}</h2>
              <p className="mt-3 max-w-2xl text-slate">{home.safetyBody}</p>
            </div>
            <Button href={localize(locale, "/seguridad")} variant="ghost">{home.safetyCta}</Button>
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {safety.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
                <span className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />{item.title}</span>
                <StatusPill
                  status={item.status}
                  label={item.status === "live" ? dict.common.available : item.status === "partial" ? dict.common.partial : dict.common.soon}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-navy-950 text-white">
        <Container className="py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{home.citiesKicker}</p>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold">{home.citiesTitle}</h2>
          <p className="mt-3 max-w-2xl text-white/70">{home.citiesBody}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="overflow-hidden rounded-[2rem] bg-navy-900 ring-1 ring-white/10">
              <div className="h-52"><SantiagoArt /></div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold">{home.santiagoTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{home.santiagoBody}</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-[2rem] bg-navy-900 ring-1 ring-white/10">
              <div className="h-52"><SantoDomingoArt /></div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold">{home.santoTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{home.santoBody}</p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section id="acceso" className="bg-white">
        <Container className="grid items-center gap-8 py-16 lg:grid-cols-2 md:py-20">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight">{earlyTitle}</h2>
            <p className="mt-3 text-slate">{earlyDescription}</p>
          </div>
          <NewsletterForm locale={locale} dict={dict} />
        </Container>
      </section>
    </>
  );
}
