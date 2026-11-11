import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 md:px-8", className)}>{children}</div>;
}

const buttonStyles = {
  primary: "bg-blue-600 text-white shadow-[0_12px_30px_-14px_rgba(0,87,245,0.95)] hover:bg-blue-700",
  secondary: "border border-white/20 bg-white/10 text-white hover:bg-white/15",
  light: "bg-white text-navy-950 hover:bg-mist",
  pin: "bg-pin text-navy-950 hover:brightness-105",
  ghost: "bg-transparent text-blue-700 hover:bg-blue-50",
  dark: "bg-navy-900 text-white hover:bg-navy-800",
} as const;

export function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  disabled,
}: {
  href?: string;
  variant?: keyof typeof buttonStyles;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const classNames = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    buttonStyles[variant],
    className,
  );
  if (href) return <Link href={href} className={classNames}>{children}</Link>;
  return <button type={type} disabled={disabled} className={classNames}>{children}</button>;
}

export function PageHero({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 map-grid" />
      <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
      <Container className="relative py-16 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{kicker}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </Container>
    </section>
  );
}

export function StatusPill({ status, label }: { status: "live" | "soon" | "partial"; label: string }) {
  const styles = {
    live: "bg-emerald-100 text-emerald-900",
    partial: "bg-amber-100 text-amber-950",
    soon: "bg-navy-900 text-white",
  };
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", styles[status])}>{label}</span>;
}
