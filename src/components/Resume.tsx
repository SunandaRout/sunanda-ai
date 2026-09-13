export default function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Resume</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Sunanda Rout — Data Analyst</h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-paperdim">
        View or download the latest resume, including analytics skills, internships, education, certifications, and selected projects.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          View Resume ↗
        </a>
        <a
          href="/resume.pdf"
          download="Sunanda-Rout-Resume.pdf"
          className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
        >
          Download PDF ↓
        </a>
      </div>
    </section>
  );
}
