import type { Dictionary } from "@/content/types";

export function Logo({ className = "h-12 w-12", alt = "DameBola" }: { className?: string; alt?: string }) {
  return <img src="/brand/logo.png" alt={alt} width={256} height={256} className={className} />;
}

export function PhoneMock({ copy }: { copy: Dictionary["ride"] }) {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="floaty rounded-[2.4rem] border border-white/15 bg-navy-950 p-2.5 shadow-[0_30px_80px_-30px_rgba(0,80,255,0.8)]">
        <div className="overflow-hidden rounded-[2rem] bg-[#07111f]">
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] text-white/70">
            <span>9:41</span>
            <span className="h-4 w-20 rounded-full bg-black" />
            <span>5G</span>
          </div>
          <div className="relative h-52">
            <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label={copy.mockCaption}>
              <rect width="320" height="220" fill="#07182e" />
              <g stroke="rgba(90,170,255,0.18)" strokeWidth="1">
                {Array.from({ length: 8 }).map((_, index) => (
                  <line key={`h${index}`} x1="0" y1={index * 28} x2="320" y2={index * 28} />
                ))}
                {Array.from({ length: 10 }).map((_, index) => (
                  <line key={`v${index}`} x1={index * 36} y1="0" x2={index * 36} y2="220" />
                ))}
              </g>
              <path d="M40 180 C 90 170, 110 80, 170 90 S 250 150, 300 40" fill="none" stroke="#1a6dff" strokeWidth="16" strokeLinecap="round" />
              <path className="road-dash" d="M40 180 C 90 170, 110 80, 170 90 S 250 150, 300 40" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="214" cy="78" r="16" fill="#2fce62" />
              <circle cx="214" cy="74" r="6" fill="white" />
            </svg>
          </div>
          <div className="space-y-2 px-3 pb-4">
            <div className="rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/10">
              <div className="flex justify-between text-[11px] text-white/60">
                <span>{copy.from}</span>
                <span>{copy.to}</span>
              </div>
              <div className="mt-1 flex justify-between gap-3 text-sm font-semibold">
                <span>{copy.fromValue}</span>
                <span>{copy.toValue}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-blue-600 p-3 text-white">
              <p className="text-[11px] uppercase tracking-wider text-white/75">{copy.yourOffer}</p>
              <p className="font-display text-2xl font-semibold">{copy.offerValue}</p>
            </div>
            <div className="rounded-2xl bg-white p-3 text-sm text-ink">
              <p className="font-semibold">{copy.accepted}</p>
              <p className="mt-1 text-slate">{copy.counter}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-white/60">{copy.mockCaption}</p>
    </div>
  );
}

export function SantiagoArt() {
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-hidden="true">
      <rect width="640" height="360" fill="#071227" />
      <g stroke="rgba(90,170,255,0.16)">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="360" />
        ))}
      </g>
      <path d="M0 280 C 120 250, 200 300, 320 270 S 520 240, 640 290 L 640 360 L 0 360 Z" fill="#0c1e3f" />
      <path d="M40 300 C 160 270, 240 250, 360 280" fill="none" stroke="#1a6dff" strokeWidth="10" strokeLinecap="round" />
      <path d="M300 250 L320 70 L340 250 Z" fill="#16325f" />
      <rect x="312" y="68" width="16" height="190" fill="#39d4ff" />
      <circle cx="320" cy="58" r="14" fill="#2fce62" />
      <circle cx="320" cy="54" r="5" fill="white" />
      <rect x="80" y="210" width="70" height="70" rx="6" fill="#10284d" />
      <rect x="180" y="180" width="54" height="100" rx="6" fill="#14315f" />
      <rect x="430" y="190" width="90" height="90" rx="8" fill="#10284d" />
      <rect x="540" y="160" width="48" height="120" rx="6" fill="#16325f" />
    </svg>
  );
}

export function SantoDomingoArt() {
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-hidden="true">
      <rect width="640" height="360" fill="#071227" />
      <path d="M0 230 C 140 200, 220 250, 360 220 S 520 180, 640 210 L 640 360 L 0 360 Z" fill="#0a3a66" />
      <path d="M0 250 C 160 230, 240 270, 400 240 S 560 250, 640 230 L 640 360 L 0 360 Z" fill="#071a33" />
      <g fill="#12305a">
        <rect x="70" y="150" width="80" height="110" />
        <path d="M70 150 Q110 110 150 150" />
        <rect x="180" y="120" width="36" height="140" />
        <rect x="168" y="108" width="60" height="18" />
        <rect x="250" y="170" width="100" height="90" />
        <path d="M250 170 Q300 130 350 170" />
        <rect x="390" y="90" width="28" height="170" />
        <rect x="430" y="140" width="70" height="120" />
        <rect x="520" y="100" width="40" height="160" />
      </g>
      <circle cx="404" cy="78" r="12" fill="#2fce62" />
      <path d="M30 300 C 180 280, 300 320, 620 290" fill="none" stroke="#39d4ff" strokeWidth="4" />
    </svg>
  );
}

export function StoreBadge({
  store,
  title,
  subtitle,
  href,
  soon,
}: {
  store: "apple" | "google";
  title: string;
  subtitle: string;
  href?: string;
  soon: string;
}) {
  const inner = (
    <>
      {store === "apple" ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path fill="currentColor" d="M16.4 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.2 1.2-2.4 1.2-2.5s-2.3-.9-2.3-3zM14.7 6.5c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path fill="#39d4ff" d="M4 3.5v17l12.2-8.5L4 3.5z" />
          <path fill="#2fce62" d="M16.2 12 4 20.5l9.2-5.3 3-3.2z" />
          <path fill="#ffce3a" d="M16.2 12 13.2 15.2 4 3.5 16.2 12z" />
        </svg>
      )}
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">{subtitle}</span>
        <span className="block text-sm font-semibold">{title}</span>
      </span>
    </>
  );
  const className = "inline-flex min-h-14 min-w-[220px] items-center gap-3 rounded-2xl bg-black px-4 py-2 text-white ring-1 ring-white/15";
  if (!href) {
    return (
      <div className={`${className} opacity-80`} aria-disabled="true">
        {inner}
        <span className="sr-only">{soon}</span>
      </div>
    );
  }
  return (
    <a className={className} href={href} rel="noopener noreferrer">
      {inner}
    </a>
  );
}
