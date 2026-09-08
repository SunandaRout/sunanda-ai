import links from "@/data/links.json";

const PLATFORMS = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

export default function ProfessionalProfiles() {
  const l = links as Record<string, string | null>;
  return (
    <section id="profiles" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Professional Profiles</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Find him online</h2>

      <div className="mt-8 flex flex-wrap gap-4">
        {PLATFORMS.map((p) =>
          l[p.key] ? (
            <a
              key={p.key}
              href={l[p.key]!}
              target="_blank"
              className="rounded-full border border-border px-5 py-2.5 text-sm text-paper transition-colors hover:border-accent"
            >
              {p.label} ↗
            </a>
          ) : (
            <span
              key={p.key}
              className="rounded-full border border-dashed border-border px-5 py-2.5 text-sm text-paperdim"
              title="Not yet added — update via admin panel"
            >
              {p.label} — not yet added
            </span>
          )
        )}
      </div>
    </section>
  );
}
