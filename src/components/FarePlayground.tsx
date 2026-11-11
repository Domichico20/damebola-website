"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/types";

export function FarePlayground({ copy }: { copy: Dictionary["fares"] }) {
  const [offer, setOffer] = useState(250);
  const [phase, setPhase] = useState<"edit" | "wait" | "counter" | "accepted" | "declined" | "other">("edit");
  const counter = offer === 250 ? 300 : offer + 50;
  const alternate = offer + 25;

  function money(value: number) {
    return `RD$${value.toLocaleString("es-DO")}`;
  }

  return (
    <div className="rounded-[2rem] bg-navy-950 p-5 text-white shadow-2xl md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">{copy.yourOffer}</p>
          <p className="font-display text-5xl font-semibold">{money(offer)}</p>
        </div>
        <label className="text-sm font-semibold">
          RD$150
          <input
            className="mx-3 align-middle accent-cyan-400"
            type="range"
            min={150}
            max={800}
            step={25}
            value={offer}
            onChange={(event) => {
              setOffer(Number(event.target.value));
              setPhase("edit");
            }}
            aria-valuetext={money(offer)}
          />
          RD$800
        </label>
      </div>
      <div className="mt-6 min-h-28 rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
        {phase === "edit" ? <p className="text-white/75">{copy.playgroundBody}</p> : null}
        {phase === "wait" ? <p>{copy.waiting}</p> : null}
        {phase === "counter" || phase === "other" ? (
          <div>
            <p className="text-sm text-cyan-300">{copy.counterLabel}</p>
            <p className="mt-1 font-display text-4xl font-semibold">{money(phase === "other" ? alternate : counter)}</p>
          </div>
        ) : null}
        {phase === "accepted" ? <p className="text-lg font-semibold text-pin">{copy.acceptedTitle}</p> : null}
        {phase === "declined" ? <p className="text-lg font-semibold">{copy.declinedTitle}</p> : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {phase === "edit" || phase === "declined" ? (
          <button type="button" className="min-h-12 rounded-full bg-blue-600 px-5 font-semibold" onClick={() => { setPhase("wait"); window.setTimeout(() => setPhase("counter"), 700); }}>{copy.send}</button>
        ) : null}
        {phase === "counter" || phase === "other" ? (
          <>
            <button type="button" className="min-h-12 rounded-full bg-pin px-5 font-semibold text-navy-950" onClick={() => setPhase("accepted")}>{copy.accept}</button>
            <button type="button" className="min-h-12 rounded-full bg-white/10 px-5 font-semibold" onClick={() => setPhase("declined")}>{copy.decline}</button>
            {phase === "counter" ? <button type="button" className="min-h-12 rounded-full bg-white/10 px-5 font-semibold" onClick={() => setPhase("other")}>{copy.other}</button> : null}
          </>
        ) : null}
        {phase !== "edit" ? <button type="button" className="min-h-12 rounded-full px-5 font-semibold text-white/80 underline" onClick={() => setPhase("edit")}>{copy.reset}</button> : null}
      </div>
      <p className="mt-5 text-sm text-white/60">{copy.disclaimer}</p>
    </div>
  );
}
