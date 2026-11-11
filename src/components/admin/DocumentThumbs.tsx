"use client";

import { useEffect, useState } from "react";

type Doc = {
  id: string;
  originalName: string;
  mimeType: string;
  kind: string;
};

type KindLabels = {
  license: string;
  registration: string;
  insurance: string;
  other: string;
};

export function DocumentThumbs({
  documents,
  kinds,
  zoomIn,
  zoomOut,
  download,
  close,
  previewFailed,
  size = "md",
}: {
  documents: Doc[];
  kinds: KindLabels;
  zoomIn: string;
  zoomOut: string;
  download: string;
  close: string;
  previewFailed: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState<Doc | null>(null);
  const [scale, setScale] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    if (!open) return;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || open.mimeType.startsWith("image/")) {
      setPdfUrl("");
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    let objectUrl = "";
    let cancelled = false;
    setFailed(false);
    fetch(`/api/admin/documents/${open.id}?view=1`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("preview");
        objectUrl = URL.createObjectURL(await response.blob());
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPdfUrl(objectUrl);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open]);

  const thumb = size === "sm" ? "h-14 w-14" : "h-28 w-28";

  return (
    <>
      <ul className="mt-2 flex flex-wrap gap-3">
        {documents.map((doc) => {
          const label = kinds[doc.kind as keyof KindLabels] || doc.kind;
          const image = doc.mimeType.startsWith("image/");
          return (
            <li key={doc.id}>
              <button
                type="button"
                className="block text-left"
                aria-label={`${label}. ${doc.originalName}`}
                onClick={() => {
                  setScale(1);
                  setOpen(doc);
                }}
              >
                {image ? (
                  <img alt="" src={`/api/admin/documents/${doc.id}?view=1`} className={`${thumb} rounded-2xl object-cover ring-1 ring-line`} />
                ) : (
                  <span className={`${thumb} flex items-center justify-center rounded-2xl bg-mist text-sm font-bold text-navy-950 ring-1 ring-line`}>PDF</span>
                )}
                <span className="mt-1 block max-w-28 truncate text-xs font-semibold text-slate">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4" role="presentation" onClick={() => setOpen(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.originalName}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-mist">
              {open.mimeType.startsWith("image/") ? (
                <img
                  alt={open.originalName}
                  src={`/api/admin/documents/${open.id}?view=1`}
                  className="mx-auto h-auto max-w-none"
                  style={{ width: `${Math.round(scale * 640)}px` }}
                />
              ) : failed ? (
                <p className="p-6 text-sm text-danger">{previewFailed}</p>
              ) : pdfUrl ? (
                <iframe title={open.originalName} src={pdfUrl} className="h-[70vh] w-full bg-white" />
              ) : (
                <p className="p-6 text-sm text-slate">…</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="mr-auto min-w-0 truncate text-sm font-semibold">{kinds[open.kind as keyof KindLabels] || open.kind} · {open.originalName}</p>
              {open.mimeType.startsWith("image/") ? (
                <>
                  <button type="button" className="min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ring-line" onClick={() => setScale((value) => Math.max(1, Number((value - 0.5).toFixed(1))))}>{zoomOut}</button>
                  <button type="button" className="min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ring-line" onClick={() => setScale((value) => Math.min(4, Number((value + 0.5).toFixed(1))))}>{zoomIn}</button>
                </>
              ) : null}
              <a className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white" href={`/api/admin/documents/${open.id}`}>{download}</a>
              <button type="button" className="min-h-11 rounded-full px-4 text-sm font-semibold text-slate" onClick={() => setOpen(null)}>{close}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
