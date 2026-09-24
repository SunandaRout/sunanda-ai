import personal from "@/data/personal.json";

const tools = [
  { label: "SQL", icon: "▦", tone: "blue" },
  { label: "Python", icon: "⌘", tone: "violet" },
  { label: "Power BI", icon: "▥", tone: "gold" },
  { label: "PostgreSQL", icon: "◉", tone: "cyan" },
];

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />

      <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.35fr] lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <div className="hero-photo-shell mx-auto max-w-[430px]">
            <div className="hero-photo-glow" />
            <div className="hero-photo-frame">
              <div className="hero-photo-inner">
                <img
                  src={personal.photoUrl || "/profile.jpeg"}
                  alt="Sunanda Rout professional portrait"
                  className="h-full w-full object-cover object-center"
                />
                <div className="hero-photo-overlay" />
                <div className="hero-availability">
                  <span className="hero-status-dot" />
                  Available for Opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="hero-kicker">✦ Welcome to my portfolio</div>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white md:text-7xl">
            Hi, I&apos;m <span className="hero-gradient-text">{personal.name}</span>
          </h1>
          <p className="mt-5 text-xl font-semibold text-slate-100 md:text-2xl">
            Data Analyst <span className="text-cyan-300">|</span> B.Tech CSE (IoT)
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            I turn raw data into meaningful insights using SQL, Python, Power BI, and modern data tools. I build interactive dashboards, solve real-world problems, and explore AI-powered analytics.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="hero-primary-btn">Explore My Work <span>→</span></a>
            <a href="#ai" className="hero-secondary-btn">▣ Chat with My AI</a>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-4 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl">
            <div className="text-center"><strong className="text-2xl text-white">5+</strong><span className="block text-xs text-slate-400">Projects</span></div>
            <div className="text-center"><strong className="text-2xl text-white">2+</strong><span className="block text-xs text-slate-400">Internships</span></div>
            <div className="text-center"><strong className="text-2xl text-white">8.0</strong><span className="block text-xs text-slate-400">CGPA</span></div>
            <div className="text-center"><strong className="text-2xl text-white">10+</strong><span className="block text-xs text-slate-400">Certificates</span></div>
          </div>

          <div className="hero-tools-wrap">
            {tools.map((tool) => (
              <div key={tool.label} className={`hero-tool hero-tool-${tool.tone}`}>
                <span className="hero-tool-icon">{tool.icon}</span>
                <span>{tool.label}</span>
              </div>
            ))}
            <div className="hero-tool hero-tool-main"><span className="hero-tool-icon">▦</span><span>Data Analytics</span></div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {[
          ["▣", "Personal AI", "Ask anything — study, projects, career guidance."],
          ["▧", "Image Editor", "Upload and edit images with AI."],
          ["▥", "Data Analysis", "Analyze CSV/Excel files with visual insights."],
          ["▤", "Resume Builder", "Create a professional resume with AI."],
          ["◇", "Career Guidance", "Get practical learning and career advice."],
        ].map(([icon, title, text]) => (
          <a key={title} href={title === "Personal AI" ? "#ai" : title === "Data Analysis" ? "#projects" : "#contact"} className="hero-feature-card group">
            <span className="hero-feature-icon">{icon}</span>
            <span><strong>{title}</strong><small>{text}</small></span>
            <b>→</b>
          </a>
        ))}
      </div>
    </section>
  );
}
