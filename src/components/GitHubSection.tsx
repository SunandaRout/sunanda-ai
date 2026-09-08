import githubData from "@/data/github.json";

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(61,220,151,0.25)]"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate font-display text-base text-paper group-hover:text-accent">{repo.name}</h3>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-paperdim">
          <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1.01-2.73-.1-.26-.44-1.3.1-2.71 0 0 .82-.27 2.7 1.04a9.16 9.16 0 0 1 4.92 0c1.88-1.3 2.7-1.04 2.7-1.04.54 1.41.2 2.45.1 2.71.63.71 1.01 1.62 1.01 2.73 0 3.91-2.35 4.77-4.58 5.02.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A9.99 9.99 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
        </svg>
      </div>
      <p className="mt-2 min-h-[2.5rem] text-sm text-paperdim">{repo.description ?? "No description provided."}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[11px] text-paperdim">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo" />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && <span>★ {repo.stars}</span>}
        {repo.forks > 0 && <span>⑂ {repo.forks}</span>}
        <span className="ml-auto">Updated {timeAgo(repo.updatedAt)}</span>
      </div>
    </a>
  );
}

export default function GitHubSection() {
  const { repositories, featured, profileUrl, lastVerified } = githubData as {
    repositories: Repo[];
    featured: string[];
    profileUrl: string;
    lastVerified: string;
  };

  const featuredRepos = repositories.filter((r) => featured.includes(r.name));
  const otherRepos = repositories.filter((r) => !featured.includes(r.name));

  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">GitHub</p>
          <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Code &amp; repositories</h2>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-5 py-2.5 text-sm text-paper transition-colors hover:border-accent"
        >
          View full profile ↗
        </a>
      </div>
      <p className="mt-2 font-mono text-[11px] text-paperdim">Verified against github.com/SunandaRout · last checked {lastVerified}</p>

      <h3 className="mt-10 font-display text-xl text-paper">Featured Projects</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredRepos.map((r) => (
          <RepoCard key={r.name} repo={r} />
        ))}
      </div>

      <h3 className="mt-12 font-display text-xl text-paper">All Repositories</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {otherRepos.map((r) => (
          <RepoCard key={r.name} repo={r} />
        ))}
      </div>
    </section>
  );
}
