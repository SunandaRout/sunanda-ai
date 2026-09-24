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
          <a href="#ai" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]">Ask my Personal AI</a>
          <a href="#resume" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-accent">View resume</a>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="group relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 p-3 shadow-[0_25px_80px_-25px_rgba(61,220,151,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[0_35px_100px_-25px_rgba(61,220,151,0.5)]">
          <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_50%_30%,rgba(61,220,151,0.16),transparent_55%)] opacity-80" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <img src="/profile.jpg" alt="Professional profile portrait" className="aspect-square w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-5 pt-16">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Data Analytics · Personal AI</p>
              <p className="mt-1 text-lg font-semibold text-white">{personal.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
