export default function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Resume</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Sunanda Rout - Data Analyst</h2>
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
          View Resume
        </a>
        <a
          href="/resume.pdf"
          download
          className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
        >
          Download Resume
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
        >
          Open PDF
        </a>
        <a
          href="https://srout-ai.vercel.app/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
        >
          Resume File Link
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        <iframe
          src="/resume.pdf"
          title="Resume preview"
          className="h-[70vh] min-h-[520px] w-full"
        />
      </div>
    </section>
  );
}
