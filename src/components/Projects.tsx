"use client";

import { useState } from "react";
import projects from "@/data/projects.json";

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = (projects as any[]).find((p) => p.id === openId) ?? null;

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Selected Work</p>
          <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Analytics projects</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-paperdim">
            Real-world analytics work across Python, SQL, Excel and Power BI. Open any project to explore the work and jump directly to its verified GitHub repository.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(projects as any[]).map((p, index) => (
          <button
            key={p.id}
            onClick={() => setOpenId(p.id)}
            className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_-24px_rgba(61,220,151,0.45)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.25em] text-paperdim">PROJECT {String(index + 1).padStart(2, "0")}</span>
              <span className="text-paperdim transition-transform group-hover:translate-x-1 group-hover:text-accent">↗</span>
            </div>
            <h3 className="mt-6 font-display text-xl text-paper group-hover:text-accent">{p.name}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-paperdim">{p.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {p.technologies.slice(0, 4).map((t: string) => (
                <span key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-paperdim">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={() => setOpenId(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Project details</p>
                <h3 className="mt-2 font-display text-2xl text-paper md:text-3xl">{active.name}</h3>
              </div>
              <button onClick={() => setOpenId(null)} className="rounded-full border border-border px-3 py-1.5 text-paperdim hover:border-accent hover:text-accent" aria-label="Close">✕</button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {active.technologies.map((t: string) => (
                <span key={t} className="rounded-full border border-border bg-ink/40 px-3 py-1.5 font-mono text-[11px] text-paperdim">{t}</span>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-border/70 bg-ink/40 p-5">
              <p className="text-sm leading-7 text-paperdim">{active.description}</p>
            </div>

            <div className="mt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paperdim">Highlights</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-paper">
                {active.highlights.map((h: string) => <li key={h} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{h}</li>)}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {active.githubUrl && (
                <a href={active.githubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                  View GitHub Repository ↗
                </a>
              )}
              {active.liveUrl && (
                <a href={active.liveUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-2.5 text-sm text-paper hover:border-accent">
                  Live Demo ↗
                </a>
              )}
            </div>
            {active.githubNote && <p className="mt-4 text-xs leading-5 text-paperdim">{active.githubNote}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
