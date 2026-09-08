import personal from "@/data/personal.json";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">About</p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl text-paper md:text-4xl">
        Turning raw datasets into decisions.
      </h2>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <p className="text-[15px] leading-relaxed text-paperdim md:col-span-2">
          {personal.summary} His current focus is {personal.currentFocus.toLowerCase()}
        </p>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-paperdim">Currently</p>
          <p className="mt-2 text-sm text-paper">{personal.currentFocus}</p>
        </div>
      </div>
    </section>
  );
}
