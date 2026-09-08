import links from "@/data/links.json";

export default function Footer() {
  const l = links as Record<string, string | null>;
  const socials = [
    { key: "github", label: "GitHub", href: l.github },
    { key: "linkedin", label: "LinkedIn", href: l.linkedin },
    { key: "email", label: "Email", href: l.email ? `mailto:${l.email}` : null },
    { key: "instagram", label: "Instagram", href: l.instagram },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-display text-lg text-paper">Sunanda Rout</p>
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Data Analyst</p>

        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-paperdim">
          {socials.map((s) => (
            <a key={s.key} href={s.href!} target={s.key === "email" ? undefined : "_blank"} rel="noreferrer" className="hover:text-accent">
              {s.label}
            </a>
          ))}
        </div>

        <p className="mt-4 font-mono text-xs text-paperdim">
          © {new Date().getFullYear()} Sunanda Rout · Built with intelligence.
        </p>
      </div>
    </footer>
  );
}
