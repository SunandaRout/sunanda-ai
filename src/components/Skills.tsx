import skills from "@/data/skills.json";

export default function Skills() {
  const entries = Object.entries(skills as Record<string, string[]>);
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Skills</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Technical toolkit</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([category, list]) => (
          <div key={category} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-paperdim">{category}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {list.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-sm text-paper">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
