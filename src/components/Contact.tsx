import links from "@/data/links.json";

type CardDef = {
  key: string;
  label: string;
  value: string | null;
  href: string | null;
  icon: JSX.Element;
};

const icons = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M4.5 4.5h3.6l1.4 4.5-2.2 1.7a12.5 12.5 0 0 0 6 6l1.7-2.2 4.5 1.4v3.6c0 1-.9 1.8-1.9 1.7-6.9-.6-12.4-6.1-13-13-.1-1 .7-1.7 1.7-1.7Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3-1.9-4.4-4.4-4.4-1.7 0-2.7.9-3.2 1.6V8.5H9.4c.04.9 0 11.5 0 11.5h2.94v-6.4c0-.35.03-.7.13-.95.28-.7.9-1.42 1.96-1.42 1.38 0 1.94 1.06 1.94 2.6V20H20v-6.4Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1.01-2.73-.1-.26-.44-1.3.1-2.71 0 0 .82-.27 2.7 1.04a9.16 9.16 0 0 1 4.92 0c1.88-1.3 2.7-1.04 2.7-1.04.54 1.41.2 2.45.1 2.71.63.71 1.01 1.62 1.01 2.73 0 3.91-2.35 4.77-4.58 5.02.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A9.99 9.99 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export default function Contact() {
  const l = links as Record<string, string | null>;

  const cards: CardDef[] = [
    { key: "email", label: "Email", value: l.email, href: l.email ? `mailto:${l.email}` : null, icon: icons.email },
    {
      key: "phone",
      label: "Phone",
      value: l.phone,
      href: l.phone ? `tel:${l.phone.replace(/\s+/g, "")}` : null,
      icon: icons.phone,
    },
    { key: "linkedin", label: "LinkedIn", value: "View profile", href: l.linkedin, icon: icons.linkedin },
    { key: "github", label: "GitHub", value: "View profile", href: l.github, icon: icons.github },
    { key: "instagram", label: "Instagram", value: l.instagram ? "View profile" : "Coming soon", href: l.instagram, icon: icons.instagram },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Contact</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Let&rsquo;s talk</h2>
      <p className="mt-4 max-w-md text-[15px] text-paperdim">
        Open to data analytics roles, internships, and collaboration. Reach out through any of these.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const disabled = !c.href;
          const Wrapper = disabled ? "div" : "a";
          return (
            <Wrapper
              key={c.key}
              {...(!disabled
                ? { href: c.href!, target: c.key === "email" || c.key === "phone" ? undefined : "_blank", rel: "noreferrer" }
                : {})}
              className={`group flex items-center gap-4 rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur transition-all ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(61,220,151,0.25)]"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-ink text-accent">
                {c.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base text-paper">{c.label}</span>
                <span className="block truncate text-xs text-paperdim">{c.value ?? "Not available yet"}</span>
              </span>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
