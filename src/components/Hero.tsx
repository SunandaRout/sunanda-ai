import personal from "@/data/personal.json";

export default function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
      <div className="flex flex-col justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Personal AI · Data Analytics</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-paper md:text-6xl">
          {personal.name}
        </h1>
        <p className="mt-3 max-w-md font-display text-xl italic text-paperdim">{personal.title}</p>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paperdim">{personal.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#ai"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Ask my Personal AI
          </a>
          <a
            href="#resume"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent"
          >
            View resume
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 font-mono text-sm shadow-[0_0_60px_-15px_rgba(61,220,151,0.15)]">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E85C5C]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8B34C]" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </div>
          <p className="text-paperdim">
            <span className="text-accent">$</span> ask --about sunanda
          </p>
          <p className="mt-2 text-paper">
            &gt; Aspiring Data Analyst · B.Tech CSE (IoT)
          </p>
          <p className="text-paper">&gt; 2 internships · 8 analytics projects</p>
          <p className="text-paper">&gt; Python · SQL · Power BI · Excel</p>
          <p className="mt-3 animate-pulse text-accent">▍</p>
        </div>
      </div>
    </section>
  );
}
