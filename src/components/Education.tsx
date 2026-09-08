import education from "@/data/education.json";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Education</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Academic background</h2>

      <div className="mt-8 space-y-4">
        {education.map((e: any) => (
          <div key={e.id} className="rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl text-paper">{e.institution}</h3>
              <span className="font-mono text-xs text-paperdim">
                {e.startYear ?? e.passingYear}
                {e.endYear ? `–${e.endYear}` : ""}
              </span>
            </div>
            <p className="mt-1 text-sm text-accent">
              {e.level}
              {e.branch ? ` · ${e.branch}` : ""}
              {e.stream ? ` · ${e.stream}` : ""}
              {e.board ? ` · ${e.board}` : ""}
            </p>
            <p className="mt-2 text-sm text-paperdim">
              {e.cgpa ? `CGPA: ${e.cgpa}` : e.percentage ? `Percentage: ${e.percentage}` : ""}
              {e.status === "ongoing" ? " · In progress" : ""}
            </p>
            {e.note && <p className="mt-2 text-xs italic text-paperdim">{e.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
