"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

const SUGGESTED = [
  "Who is Sunanda Rout?",
  "Tell me about his education.",
  "What is his CGPA?",
  "What are his technical skills?",
  "Tell me about his experience at Cognifyz Technologies.",
  "What does he do at Infotact Solutions?",
  "Is Sunanda a Campus Ambassador?",
  "What projects has he built?",
  "Tell me about his Netflix Data Analysis project.",
  "What certifications does he have?",
  "What is Sunanda's GitHub?",
  "How many repositories does he have on GitHub?",
];

function useTypedText(fullText: string, active: boolean) {
  const [shown, setShown] = useState(active ? "" : fullText);

  useEffect(() => {
    if (!active) {
      setShown(fullText);
      return;
    }
    setShown("");
    let i = 0;
    const step = Math.max(1, Math.floor(fullText.length / 120));
    const interval = setInterval(() => {
      i += step;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [fullText, active]);

  return shown;
}

function AssistantBubble({ content, animate, image }: { content: string; animate: boolean; image?: string }) {
  const typed = useTypedText(content, animate);
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed text-paper">
      {image && (
        <div className="mb-3 overflow-hidden rounded-xl border border-border bg-black/20">
          <img src={image} alt="AI generated" className="block w-full max-w-[520px]" />
          <a
            href={image}
            download="sunanda-ai-generated.png"
            className="block border-t border-border px-3 py-2 text-center text-xs text-paperdim transition-colors hover:text-accent"
          >
            Download image
          </a>
        </div>
      )}
      <p className="whitespace-pre-line">{typed}</p>
      {!image && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="mt-2 text-xs text-paperdim opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

export default function PersonalAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I'm Sunanda Rout's Personal AI. Ask me about his personal profile, family, education, experience, projects, skills, certifications, or GitHub — I answer from his explicit knowledge base.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAssistantId, setLastAssistantId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, imageLoading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || imageLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");

      const assistantId = crypto.randomUUID();
      setLastAssistantId(assistantId);
      setMessages((m) => [...m, { id: assistantId, role: "assistant", content: data.answer }]);
    } catch (e: any) {
      setError(e.message ?? "Couldn't reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || imageLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: `🖼️ Generate image: ${trimmed}` };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setImageLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Image generation failed.");

      const assistantId = crypto.randomUUID();
      setLastAssistantId(assistantId);
      setMessages((m) => [
        ...m,
        { id: assistantId, role: "assistant", content: "Here is your generated image.", image: data.image },
      ]);
    } catch (e: any) {
      setError(e.message ?? "Couldn't generate the image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi, I'm Sunanda Rout's Personal AI. Ask me about his personal profile, family, education, experience, projects, skills, certifications, or GitHub — I answer from his explicit knowledge base.",
      },
    ]);
    setError(null);
  }

  return (
    <section id="ai" className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Personal AI</p>
      <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">Ask me anything about Sunanda.</h2>
      <p className="mt-3 max-w-xl text-[15px] text-paperdim">
        This assistant answers only from verified information Sunanda has provided. If something isn't
        confirmed yet, it will say so instead of guessing. You can also generate images with AI.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-[#0E1219]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-xs text-paperdim">sunanda-ai · knowledge-base</span>
          </div>
          <button onClick={clearChat} className="text-xs text-paperdim transition-colors hover:text-accent">
            Clear chat
          </button>
        </div>

        <div ref={scrollRef} className="kb-scrollbar flex h-[420px] flex-col gap-4 overflow-y-auto px-4 py-5">
          {messages.map((m) =>
            m.role === "user" ? (
              <div
                key={m.id}
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo/90 px-4 py-3 text-[15px] leading-relaxed text-white"
              >
                {m.content}
              </div>
            ) : (
              <AssistantBubble key={m.id} content={m.content} image={m.image} animate={m.id === lastAssistantId} />
            )
          )}

          {(loading || imageLoading) && (
            <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm text-paperdim">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paperdim [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paperdim [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paperdim" />
              {imageLoading ? "Creating your image..." : "Thinking..."}
            </div>
          )}

          {error && (
            <div className="max-w-[85%] rounded-2xl border border-[#E85C5C]/40 bg-[#E85C5C]/10 px-4 py-3 text-sm text-[#F5A3A3]">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {SUGGESTED.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-paperdim transition-colors hover:border-accent hover:text-accent"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Sunanda or describe an image to create..."
              className="flex-1 bg-transparent text-[15px] text-paper placeholder:text-paperdim/60 focus:outline-none"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={loading || imageLoading || !input.trim()}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity disabled:opacity-40"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => generateImage(input)}
              disabled={loading || imageLoading || !input.trim()}
              className="rounded-full border border-accent/60 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
            >
              🖼️ Generate Image
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
