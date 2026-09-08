"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FILES = [
  "personal",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "learning",
  "links",
  "github",
  "family",
  "privacy",
] as const;

export default function AdminDashboard() {
  const [activeFile, setActiveFile] = useState<(typeof FILES)[number]>("personal");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    load(activeFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile]);

  async function load(file: string) {
    setLoading(true);
    setStatus(null);
    const res = await fetch(`/api/admin/data?file=${file}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setContent(JSON.stringify(data.content, null, 2));
    setLoading(false);
  }

  async function save() {
    setStatus(null);
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      setStatus("error: invalid JSON — fix the syntax before saving.");
      return;
    }
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: activeFile, content: parsed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(`error: ${data.error}`);
    } else {
      setStatus("Saved. The Personal AI now reflects this update.");
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-10 text-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-2xl">Knowledge base admin</h1>
        <button onClick={logout} className="text-sm text-paperdim hover:text-accent">
          Log out
        </button>
      </div>

      <div className="mx-auto mt-8 flex max-w-5xl gap-8">
        <nav className="w-40 shrink-0">
          {FILES.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFile(f)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm capitalize ${
                activeFile === f ? "bg-accent text-ink" : "text-paperdim hover:bg-surface"
              }`}
            >
              {f}
            </button>
          ))}
        </nav>

        <div className="flex-1">
          <p className="mb-2 text-xs text-paperdim">
            Editing <span className="font-mono">{activeFile}.json</span> — this feeds directly into the AI's
            answers. Mark unverified facts clearly rather than presenting them as confirmed.
          </p>
          {loading ? (
            <p className="text-sm text-paperdim">Loading…</p>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              className="h-[500px] w-full rounded-xl border border-border bg-surface p-4 font-mono text-xs text-paper focus:outline-none focus:ring-1 focus:ring-accent"
            />
          )}
          <div className="mt-4 flex items-center gap-4">
            <button onClick={save} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink">
              Save changes
            </button>
            {status && (
              <p className={`text-sm ${status.startsWith("error") ? "text-[#F5A3A3]" : "text-accent"}`}>{status}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
