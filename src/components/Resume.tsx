export default function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Resume</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Full resume</h2>
      <p className="mt-4 max-w-md text-sm text-paperdim">
        Download the latest resume PDF. Replace <code className="font-mono text-xs">/public/resume.pdf</code> with
        the real file — it isn't included in this build since no PDF was attached.
      </p>
      <a
        href="/resume.pdf"
        download
        className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
      >
        Download Resume (PDF)
      </a>
    </section>
  );
}
