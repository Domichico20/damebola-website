"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/content/types";
import { localize, type Locale } from "@/lib/routes";

export type HelpFaq = { audience: string; question: string; answer: string };
export type HelpArticle = { audience: string; slug: string; title: string; summary: string };

function norm(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function HelpCenter({
  locale,
  copy,
  faqs,
  articles,
}: {
  locale: Locale;
  copy: Dictionary["help"];
  faqs: HelpFaq[];
  articles: HelpArticle[];
}) {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<"all" | "passenger" | "driver">("all");
  const [open, setOpen] = useState<number | null>(0);
  const needle = norm(query);

  const visibleFaqs = useMemo(() => faqs.filter((item) => {
    const audienceOk = audience === "all" || item.audience === audience;
    const text = norm(`${item.question} ${item.answer}`);
    return audienceOk && (!needle || text.includes(needle));
  }), [faqs, audience, needle]);

  const visibleArticles = useMemo(() => articles.filter((item) => {
    const audienceOk = audience === "all" || item.audience === audience || item.audience === "all";
    const text = norm(`${item.title} ${item.summary}`);
    return audienceOk && (!needle || text.includes(needle));
  }), [articles, audience, needle]);

  const filters = [
    ["all", copy.all],
    ["passenger", copy.passengers],
    ["driver", copy.drivers],
  ] as const;

  return (
    <div>
      <label className="block text-sm font-semibold" htmlFor="ayuda-buscar">{copy.searchLabel}
        <input id="ayuda-buscar" className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={copy.searchLabel}>
        {filters.map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={audience === value} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${audience === value ? "bg-navy-900 text-white" : "bg-white text-ink ring-1 ring-line"}`} onClick={() => setAudience(value)}>
            {label}
          </button>
        ))}
      </div>
      <h2 className="mt-10 font-display text-3xl font-semibold">{copy.faqs}</h2>
      <div className="mt-4 divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
        {visibleFaqs.length === 0 ? <p className="p-5 text-slate">{copy.empty}</p> : visibleFaqs.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={`${item.question}-${index}`}>
              <button type="button" className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : index)}>
                {item.question}
                <span aria-hidden="true">{expanded ? "–" : "+"}</span>
              </button>
              {expanded ? <p className="px-5 pb-5 leading-relaxed text-slate">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
      <h2 className="mt-10 font-display text-3xl font-semibold">{copy.articles}</h2>
      <div className="mt-4 grid gap-4">
        {visibleArticles.length === 0 ? <p className="text-slate">{copy.noArticles}</p> : visibleArticles.map((article) => (
          <Link key={article.slug} href={localize(locale, `/ayuda/${article.slug}`)} className="card-hover rounded-3xl bg-white p-5 ring-1 ring-line">
            <h3 className="font-display text-2xl font-semibold">{article.title}</h3>
            <p className="mt-2 text-slate">{article.summary}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-blue-700">{copy.read}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
