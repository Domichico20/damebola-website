"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Dictionary } from "@/content/types";
import { Logo } from "@/components/brand";
import { localize, swapLocale, type Locale } from "@/lib/routes";
import { cn } from "@/lib/cn";

const primary = [
  { href: "/como-funciona", key: "how" },
  { href: "/viaja", key: "ride" },
  { href: "/conduce", key: "drive" },
  { href: "/seguridad", key: "safety" },
  { href: "/tarifas", key: "fares" },
] as const;

const company = [
  { href: "/nosotros", key: "about" },
  { href: "/ayuda", key: "help" },
  { href: "/contacto", key: "contact" },
] as const;

export function Header({ locale, pathname, nav }: { locale: Locale; pathname: string; nav: Dictionary["nav"] }) {
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  useEffect(() => {
    setOpen(false);
    setCompanyOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setCompanyOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function itemClass(href: string) {
    const active = bare === href || (href !== "/" && bare.startsWith(href));
    return cn(
      "whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white",
      active && "bg-white/10 text-white",
    );
  }

  const menu = (
    <ul className="flex flex-col gap-1 lg:hidden">
      <li><Link className={itemClass("/")} href={localize(locale, "/")}>{nav.home}</Link></li>
      {primary.map((item) => (
        <li key={item.href}><Link className={itemClass(item.href)} href={localize(locale, item.href)}>{nav[item.key]}</Link></li>
      ))}
      {company.map((item) => (
        <li key={item.href}><Link className={itemClass(item.href)} href={localize(locale, item.href)}>{nav[item.key]}</Link></li>
      ))}
    </ul>
  );

  return (
    <header className="border-b border-white/10 bg-navy-950/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 md:px-8">
        <Link href={localize(locale, "/")} className="flex items-center gap-2" aria-label={nav.home}>
          <Logo className="h-11 w-11 rounded-2xl" alt="" />
          <span className="font-display text-lg font-semibold tracking-tight">Dame<span className="text-blue-400">Bola</span></span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label={nav.primary}>
          {primary.map((item) => (
            <Link key={item.href} className={itemClass(item.href)} href={localize(locale, item.href)}>{nav[item.key]}</Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"
              aria-expanded={companyOpen}
              onClick={() => setCompanyOpen((value) => !value)}
            >
              {nav.company}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {companyOpen ? (
              <div className="absolute left-0 top-12 z-20 min-w-52 rounded-2xl border border-white/10 bg-navy-900 p-2 shadow-2xl">
                {company.map((item) => (
                  <Link key={item.href} className="block rounded-xl px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white" href={localize(locale, item.href)}>
                    {nav[item.key]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label={nav.language} className="flex rounded-full bg-white/10 p-1 text-xs font-bold">
            <Link href={swapLocale(pathname, "es")} hrefLang="es" lang="es" className={cn("rounded-full px-2.5 py-1.5", locale === "es" ? "bg-white text-navy-950" : "text-white/80")} aria-current={locale === "es" ? "true" : undefined}>ES</Link>
            <Link href={swapLocale(pathname, "en")} hrefLang="en" lang="en" className={cn("rounded-full px-2.5 py-1.5", locale === "en" ? "bg-white text-navy-950" : "text-white/80")} aria-current={locale === "en" ? "true" : undefined}>EN</Link>
          </nav>
          <Link href={localize(locale, "/descargar")} className="hidden whitespace-nowrap rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:inline-flex">{nav.download}</Link>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 lg:hidden" aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">{open ? nav.close : nav.open}</span>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open ? (
        <div id="menu-movil" className="border-t border-white/10 px-5 py-4 lg:hidden">
          {menu}
          <Link href={localize(locale, "/descargar")} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-600 px-4 font-semibold">{nav.download}</Link>
        </div>
      ) : null}
    </header>
  );
}
