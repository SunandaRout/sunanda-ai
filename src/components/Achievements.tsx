import achievements from "@/data/achievements.json";

export default function Achievements() {
  const items = achievements as any[];
  return (
    <section id="achievements" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Achievements</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Recognition</h2>

      {items.length === 0 ? (
        <p className="mt-6 max-w-md text-sm text-paperdim">
          No achievements have been verified and added yet. Add awards, recognitions, or leadership roles
          (such as the Student Brand Ambassador role at Riseflake) through the admin panel once you can confirm
          the details.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((a: any) => (
            <li key={a.id} className="rounded-xl border border-border bg-surface p-4 text-sm text-paper">
              {a.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
