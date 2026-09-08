"use client";

import { useState } from "react";
import certifications from "@/data/certifications.json";

type Cert = {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  skills: string[];
  previewFile?: string | null;
  previewType?: "image" | "pdf" | null;
  note?: string;
};

function fmt(d?: string | null) {
  if (!d) return null;
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return m && months[idx] ? `${months[idx]} ${y}` : d;
}

export default function Certifications() {
  const items = certifications as Cert[];
  const [openId, setOpenId] = useState<string | null>(null);
  const active = items.find((c) => c.id === openId) ?? null;

  return (
    <section id="certifications" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Certifications</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Certificates</h2>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-paperdim">
            No certificates have been added yet. Upload internship and course certificates through the admin
            panel to populate this gallery.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpenId(c.id)}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(61,220,151,0.25)]"
            >
              <div className="mb-4 flex h-28 items-center justify-center rounded-xl border border-border/70 bg-ink/60">
                {c.previewFile ? (
                  <span className="text-xs text-paperdim">Preview available</span>
                ) : (
                  <span className="font-mono text-[11px] text-paperdim">Certificate on file — no preview yet</span>
                )}
              </div>
              <h3 className="font-display text-lg text-paper group-hover:text-accent">{c.name}</h3>
              <p className="mt-1 text-sm text-accent">{c.organization}</p>
              <p className="mt-1 font-mono text-xs text-paperdim">
                {fmt(c.issueDate)}
                {c.expirationDate ? ` – ${fmt(c.expirationDate)}` : ""}
              </p>
              {c.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-paperdim">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <span className="mt-4 text-xs font-medium text-accent">View certificate →</span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl text-paper">{active.name}</h3>
              <button onClick={() => setOpenId(null)} className="text-paperdim hover:text-accent" aria-label="Close">
                ✕
              </button>
            </div>

            <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-border/70 bg-ink/60">
              {active.previewFile ? (
                active.previewType === "pdf" ? (
                  <iframe src={active.previewFile} className="h-full w-full rounded-xl" title={active.name} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={active.previewFile} alt={active.name} className="max-h-full max-w-full rounded-lg object-contain" />
                )
              ) : (
                <p className="px-6 text-center text-xs text-paperdim">
                  No certificate file uploaded yet. Add it via the admin panel to enable a preview here.
                </p>
              )}
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-paperdim">Organization</dt>
                <dd className="text-paper">{active.organization}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-paperdim">Issued</dt>
                <dd className="text-paper">
                  {fmt(active.issueDate)}
                  {active.expirationDate ? ` · Expires ${fmt(active.expirationDate)}` : ""}
                </dd>
              </div>
              {active.credentialId && (
                <div className="flex justify-between gap-4">
                  <dt className="text-paperdim">Credential ID</dt>
                  <dd className="font-mono text-xs text-paper">{active.credentialId}</dd>
                </div>
              )}
            </dl>

            {active.note && <p className="mt-4 text-xs italic text-paperdim">{active.note}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              {active.credentialUrl ? (
                <a
                  href={active.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink"
                >
                  View Credential ↗
                </a>
              ) : (
                <p className="text-xs italic text-paperdim">
                  No public credential URL for this certificate — verified via the uploaded certificate file.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
