"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/content/types";

export function CookieBanner({ copy, analyticsId }: { copy: Dictionary["cookie"]; analyticsId: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("db_consent")) setVisible(true);
  }, []);
  if (!visible) return null;

  function choose(value: "all" | "essential") {
    const stored = !analyticsId && value === "all" ? "essential" : value;
    localStorage.setItem("db_consent", stored);
    document.cookie = `db_consent=${stored}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event("db-consent"));
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl bg-navy-950 p-5 text-white shadow-2xl md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold">{copy.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/75">{copy.body}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="min-h-11 rounded-full bg-white/10 px-4 text-sm font-semibold" onClick={() => choose("essential")}>{copy.essential}</button>
          <button type="button" className="min-h-11 rounded-full bg-blue-600 px-4 text-sm font-semibold" onClick={() => choose("all")}>{copy.accept}</button>
        </div>
      </div>
    </div>
  );
}

export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    function load() {
      if (localStorage.getItem("db_consent") !== "all" || document.getElementById("ga-script")) return;
      const script = document.createElement("script");
      script.id = "ga-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
      const inline = document.createElement("script");
      inline.id = "ga-inline";
      inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
      document.head.appendChild(inline);
    }
    load();
    window.addEventListener("db-consent", load);
    return () => window.removeEventListener("db-consent", load);
  }, [id]);
  return null;
}

export function VisitBeacon() {
  const pathname = usePathname() || "/";
  useEffect(() => {
    const key = `db_view:${pathname}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}
