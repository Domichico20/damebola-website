import Link from "next/link";
import type { Dictionary } from "@/content/types";
import { Logo } from "@/components/brand";
import { Container } from "@/components/ui";
import { localize, type Locale } from "@/lib/routes";

const links = {
  company: [
    ["/", "home"],
    ["/nosotros", "about"],
    ["/seguridad", "safety"],
    ["/tarifas", "fares"],
    ["/ayuda", "help"],
    ["/contacto", "contact"],
  ],
  passengers: [
    ["/viaja", "ride"],
    ["/como-funciona", "how"],
    ["/descargar", "download"],
  ],
  drivers: [
    ["/conduce", "drive"],
    ["/descargar", "download"],
    ["/ayuda", "help"],
  ],
} as const;

export function Footer({
  locale,
  dict,
  socials,
  email,
  address,
}: {
  locale: Locale;
  dict: Dictionary;
  socials: Array<{ href: string; label: string }>;
  email: string;
  address: string;
}) {
  const year = new Date().getFullYear();
  const nav = dict.nav;
  const labels: Record<string, string> = {
    home: nav.home,
    about: nav.about,
    safety: nav.safety,
    fares: nav.fares,
    help: nav.help,
    contact: nav.contact,
    ride: nav.ride,
    how: nav.how,
    download: nav.download,
    drive: nav.drive,
  };
  const legal = [
    ["/legal/privacidad", dict.footer.privacy],
    ["/legal/terminos", dict.footer.terms],
    ["/legal/cookies", dict.footer.cookies],
    ["/legal/terminos-conductores", dict.footer.driverTerms],
    ["/legal/terminos-pasajeros", dict.footer.passengerTerms],
    ["/legal/comunidad", dict.footer.community],
    ["/legal/politica-seguridad", dict.footer.safetyPolicy],
    ["/legal/eliminacion-datos", dict.footer.deletion],
  ] as const;

  return (
    <footer className="bg-navy-950 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-14 w-14 rounded-2xl" />
            <span className="font-display text-2xl font-semibold">Dame<span className="text-blue-400">Bola</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{dict.footer.blurb}</p>
          <p className="mt-4 text-sm font-semibold text-cyan-300">{dict.footer.slogan}</p>
          <p className="mt-2 text-sm text-white/60">{dict.footer.phrase}</p>
        </div>
        <FooterCol title={dict.footer.company} items={links.company} labels={labels} locale={locale} />
        <FooterCol title={dict.footer.passengers} items={links.passengers} labels={labels} locale={locale} />
        <FooterCol title={dict.footer.drivers} items={links.drivers} labels={labels} locale={locale} />
      </Container>
      <Container className="border-t border-white/10 py-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
          {legal.map(([href, label]) => (
            <Link key={href} className="hover:text-white" href={localize(locale, href)}>{label}</Link>
          ))}
        </div>
        {socials.length ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {socials.map((item) => (
              <a key={item.href} className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15" href={item.href} rel="noopener noreferrer">{item.label}</a>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} DAMEBOLA LLC. {dict.footer.rights}</p>
          <div className="space-y-1 md:text-right">
            <p>{dict.footer.brand}</p>
            <p><a className="hover:text-white" href={`mailto:${email}`}>{email}</a></p>
            {address ? <p>{address}</p> : null}
            <p>{dict.footer.florida}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  labels,
  locale,
}: {
  title: string;
  items: readonly (readonly [string, string])[];
  labels: Record<string, string>;
  locale: Locale;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white/50">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map(([href, key]) => (
          <li key={`${title}-${href}`}>
            <Link className="text-sm text-white/80 hover:text-white" href={localize(locale, href)}>{labels[key]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
