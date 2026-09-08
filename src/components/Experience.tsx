import experience from "@/data/experience.json";

function fmt(d: string) {
  if (d === "Present" || !d) return d || "—";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return m && months[idx] ? `${months[idx]} ${y}` : d;
}

export default function Experience() {
  const verified = (experience as any[]).filter((e) => e.verified);
  const unverified = (experience as any[]).filter((e) => !e.verified);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Experience</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Career timeline</h2>

      <div className="relative mt-10 border-l border-border pl-8">
        {verified.map((e) => (
          <div key={e.id} className="relative mb-10 last:mb-0">
            <span className="absolute -left-[2.31rem] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-ink" />
            <p className="font-mono text-xs text-paperdim">
              {fmt(e.startDate)} → {fmt(e.endDate)}
            </p>
            <h3 className="mt-1 font-display text-xl text-paper">{e.position}</h3>
            <p className="text-sm text-accent">
              {e.company} · {e.type} · {e.location}
            </p>
            {e.responsibilities.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-paperdim">
                {e.responsibilities.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
            {e.skillsUsed?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {e.skillsUsed.map((s: string) => (
                  <span key={s} className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-paperdim">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {e.note && <p className="mt-3 text-xs italic text-paperdim">{e.note}</p>}
          </div>
        ))}

        {unverified.map((e) => (
          <div key={e.id} className="relative mb-10 last:mb-0 opacity-60">
            <span className="absolute -left-[2.31rem] top-1.5 h-3 w-3 rounded-full border border-paperdim bg-ink" />
            <h3 className="font-display text-xl text-paper">{e.position}</h3>
            <p className="text-sm text-paperdim">{e.company}</p>
            <p className="mt-2 max-w-md text-xs italic text-paperdim">{e.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
