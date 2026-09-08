import learning from "@/data/learning.json";

export default function LearningJourney() {
  const topics = learning.currentlyLearning ?? [];
  return (
    <section id="learning" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Learning Journey</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">What's next</h2>

      {topics.length === 0 ? (
        <p className="mt-6 max-w-md text-sm text-paperdim">
          Current learning topics haven't been confirmed yet — this section will update once added via the
          admin panel.
        </p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          {topics.map((t: string) => (
            <span key={t} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm text-accent">
              {t}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
