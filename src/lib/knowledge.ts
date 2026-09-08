import personal from "@/data/personal.json";
import family from "@/data/family.json";
import education from "@/data/education.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import certifications from "@/data/certifications.json";
import achievements from "@/data/achievements.json";
import learning from "@/data/learning.json";
import links from "@/data/links.json";
import githubData from "@/data/github.json";

const FALLBACK = "I don't have that information in my personal knowledge base yet.";

type Intent =
  | "family"
  | "identity"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "learning"
  | "links"
  | "goals"
  | "unknown";

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function detectIntent(query: string): Intent {
  const q = norm(query);
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  // Family must be checked before the generic "who is" identity intent.
  if (has(
    "father", "dad", "mother", "mom", "mummy", "brother", "sister", "sibling", "jiju",
    "brother in law", "uncle", "aunt", "grandfather", "grandmother", "grandpa", "grandma",
    "mamu", "omm", "maushi", "aja", "aain", "my world", "my love", "love", "world"
  )) return "family";
  if (has("who is", "about him", "about sunanda", "introduce")) return "identity";
  if (has("study", "studied", "education", "college", "school", "10th", "matriculation", "cgpa", "percentage", "branch", "b tech", "btech", "degree", "12th", "plus two", "higher secondary")) return "education";
  if (has("intern", "experience", "cognifyz", "eduskills", "riseflake", "bluestock", "infotact", "brand ambassador", "job", "work at", "worked at")) return "experience";
  if (has("project", "netflix", "dashboard", "fraud", "vaccination", "hotel booking", "retail sales", "bank of canada", "shopping behaviour", "shopping behavior", "phonepay")) return "projects";
  if (has("skill", "technolog", "know python", "know sql", "power bi", "tools", "tech stack")) return "skills";
  if (has("certificat", "certification", "credential")) return "certifications";
  if (has("achievement", "award", "recognition")) return "achievements";
  if (has("learning", "currently learning", "learning now", "learning journey")) return "learning";
  if (has("repositor", "repo", "repos", "code on github", "how many projects on github")) return "links";
  if (has("github", "linkedin", "contact", "email", "phone", "number", "instagram", "profile link", "social")) return "links";
  if (has("goal", "career goal", "future plan", "aspiration", "aim")) return "goals";
  return "unknown";
}

function fmtDate(d: string | null) { return d ?? "an unspecified date"; }
function list(values: string[]) {
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function answerFamily(query: string): string {
  const q = norm(query);
  const f = family as any;
  if (q.includes("my love") || (q.includes("love") && !q.includes("love language"))) return `Sunanda has identified ${f.specialRelationships.myLove} as "my love" in his personal profile.`;
  if (q.includes("my world") || q.includes("world")) return `Sunanda has identified ${f.specialRelationships.myWorld} as "my world" in his personal profile.`;
  if (q.includes("father") || q.includes("dad")) return `Sunanda's father is ${f.father}.`;
  if (q.includes("mother") || q.includes("mom") || q.includes("mummy")) return `Sunanda's mother is ${f.mother}.`;
  if (q.includes("brother in law") || q.includes("jiju")) return `Sunanda's Jiju is ${f.jiju}.`;
  if (q.includes("brother") || q.includes("sibling")) return `Sunanda's brothers are ${list(f.brothers)}.`;
  if (q.includes("sister")) return `Sunanda's sisters are ${list(f.sisters)}.`;
  if (q.includes("grandfather") || q.includes("grandpa")) return `Sunanda's grandfather is ${list(f.grandfather)}.`;
  if (q.includes("grandmother") || q.includes("grandma")) return `Sunanda's grandmother is ${list(f.grandmother)}.`;
  if (q.includes("uncle")) return `Sunanda's uncle is ${list(f.uncle)}.`;
  if (q.includes("aunt")) return `Sunanda's aunt is ${list(f.aunt)}.`;
  if (q.includes("mamu")) return `Sunanda's Mamu is ${list(f.mamu)}.`;
  if (q.includes("maushi")) return `Sunanda's Maushi are ${list(f.maushi)}.`;
  if (q.includes("aja")) return `Sunanda's Aja are ${list(f.aja)}.`;
  if (q.includes("aain")) return `Sunanda's Aain are ${list(f.aain)}.`;
  if (q.includes("omm")) return `Sunanda's Omm is ${list(f.omm)}.`;
  return `Sunanda's family and personal relationship information includes his parents, siblings, extended family, and the special relationships he has explicitly provided. Ask about a specific relationship for the exact name.`;
}

function answerIdentity(): string { return `${personal.name} is ${personal.title.toLowerCase()}. ${personal.summary}`; }

function answerEducation(query: string): string {
  const q = norm(query); const items = education as any[];
  if (q.includes("10th") || q.includes("matricul")) { const m = items.find((i) => i.id === "matriculation"); return m ? `Sunanda completed his 10th (Matriculation) at ${m.institution}, under the ${m.board} board, in ${m.passingYear}, scoring ${m.percentage}.` : FALLBACK; }
  if (q.includes("12th") || q.includes("plus two") || q.includes("higher secondary")) { const p = items.find((i) => i.id === "plusTwo"); return p ? `Sunanda completed his +2 in the ${p.stream} stream at ${p.institution} (${p.startYear}–${p.endYear}), scoring ${p.percentage}.` : FALLBACK; }
  if (q.includes("cgpa")) { const b = items.find((i) => i.id === "btech"); return b?.cgpa ? `Sunanda's current CGPA in his B.Tech program is ${b.cgpa}.` : FALLBACK; }
  if (q.includes("branch") || q.includes("b tech") || q.includes("btech") || q.includes("studying now") || q.includes("current")) { const b = items.find((i) => i.id === "btech"); return b ? `Sunanda is currently pursuing a B.Tech in ${b.branch} at ${b.institution} (${b.startYear}–${b.endYear}, expected). His current CGPA is ${b.cgpa}.` : FALLBACK; }
  const lines = items.map((i: any) => i.level === "B.Tech" ? `${i.level}: ${i.branch} at ${i.institution} (${i.startYear}–${i.endYear}), CGPA ${i.cgpa}` : i.level === "+2 (Higher Secondary)" ? `${i.level}: ${i.stream} at ${i.institution} (${i.startYear}–${i.endYear}), ${i.percentage}` : `${i.level}: ${i.institution}, ${i.board} (${i.passingYear}), ${i.percentage}`);
  return `Sunanda's education:\n- ${lines.join("\n- ")}`;
}

function answerExperience(query: string): string {
  const q = norm(query); const items = experience as any[]; const match = items.find((e) => q.includes(e.company.toLowerCase()) || q.includes(e.id));
  if (match) { const resp = match.responsibilities?.length ? match.responsibilities.join("; ") : "not specified"; return `At ${match.company}, Sunanda worked as a ${match.position} (${match.type}, ${fmtDate(match.startDate)} to ${fmtDate(match.endDate)}, ${match.location}). Responsibilities included: ${resp}. Skills used: ${match.skillsUsed?.join(", ") || "not specified"}.`; }
  const verified = items.filter((e) => e.verified); if (!verified.length) return FALLBACK;
  return `Sunanda's verified experience: ${verified.map((e: any) => `${e.position} at ${e.company} (${fmtDate(e.startDate)}–${fmtDate(e.endDate)}, ${e.location})`).join("; ")}. Ask about a specific company for more detail.`;
}

function answerProjects(query: string): string {
  const q = norm(query); const items = projects as any[]; const match = items.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.id.replace(/-/g, " ")) || (q.includes("phonepay") && p.id === "phonepay-analysis"));
  if (match) return `"${match.name}" (${match.technologies.join(", ")}): ${match.description} Key work: ${match.highlights.join("; ")}.${match.githubUrl ? ` GitHub: ${match.githubUrl}` : ""}`;
  return `Sunanda's main analytics projects include: ${items.map((p) => p.name).join(", ")}. Ask about any one by name for details.`;
}

function answerSkills(query: string): string {
  const q = norm(query); const cats = skills as Record<string, string[]>;
  for (const [cat, values] of Object.entries(cats)) if (q.includes(cat.toLowerCase())) return `${cat}: ${values.join(", ")}.`;
  return `Sunanda's skills span: ${Object.entries(cats).map(([cat, values]) => `${cat} (${values.join(", ")})`).join("; ")}.`;
}
function answerCertifications(): string { return certifications.length ? (certifications as any[]).map((c) => `${c.name} — ${c.organization} (${c.issueDate ?? "date not provided"})`).join("; ") : FALLBACK; }
function answerAchievements(): string { return achievements.length ? (achievements as any[]).map((a) => a.title).join("; ") : FALLBACK; }
function answerLearning(): string { return learning.currentlyLearning?.length ? `Sunanda is currently learning: ${learning.currentlyLearning.join(", ")}.` : FALLBACK; }
function answerLinks(query: string): string {
  const q = norm(query);
  if (q.includes("repositor") || q.includes("repo") || q.includes("how many projects on github")) return `Sunanda has ${githubData.repositories.length} public repositories on GitHub (${githubData.profileUrl}), verified as of ${githubData.lastVerified}.`;
  if (q.includes("github")) return links.github ? `Sunanda's GitHub: ${links.github}` : FALLBACK;
  if (q.includes("linkedin")) return links.linkedin ? `Sunanda's LinkedIn: ${links.linkedin}` : FALLBACK;
  if (q.includes("instagram")) return links.instagram ? `Sunanda's Instagram: ${links.instagram}` : FALLBACK;
  if (q.includes("phone") || q.includes("number")) return links.phone ? `Sunanda's phone number: ${links.phone}` : FALLBACK;
  if (q.includes("email") || q.includes("contact")) return links.email ? `You can reach Sunanda at ${links.email}` : FALLBACK;
  return [links.github && `GitHub: ${links.github}`, links.linkedin && `LinkedIn: ${links.linkedin}`, links.email && `Email: ${links.email}`, links.phone && `Phone: ${links.phone}`].filter(Boolean).join(" · ") || FALLBACK;
}
function answerGoals(): string { const goals = personal.careerGoals; return goals.shortTerm.startsWith("Needs verification") && goals.longTerm.startsWith("Needs verification") ? FALLBACK : `Short-term: ${goals.shortTerm} Long-term: ${goals.longTerm}`; }

export function answerQuestion(query: string): { answer: string; intent: Intent } {
  const intent = detectIntent(query); let answer: string;
  switch (intent) {
    case "family": answer = answerFamily(query); break;
    case "identity": answer = answerIdentity(); break;
    case "education": answer = answerEducation(query); break;
    case "experience": answer = answerExperience(query); break;
    case "projects": answer = answerProjects(query); break;
    case "skills": answer = answerSkills(query); break;
    case "certifications": answer = answerCertifications(); break;
    case "achievements": answer = answerAchievements(); break;
    case "learning": answer = answerLearning(); break;
    case "links": answer = answerLinks(query); break;
    case "goals": answer = answerGoals(); break;
    default: answer = "I can answer questions about Sunanda's personal profile, family, education, experience, projects, skills, certifications, GitHub, and career goals. Could you rephrase your question?";
  }
  return { answer, intent };
}

export const KNOWLEDGE = { personal, family, education, experience, projects, skills, certifications, achievements, learning, links, githubData };
export const FALLBACK_LINE = FALLBACK;
