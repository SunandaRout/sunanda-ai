import { NextRequest, NextResponse } from "next/server";
import { answerQuestion, KNOWLEDGE } from "@/lib/knowledge";

export const runtime = "nodejs";

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

type Source = { title: string; url: string };

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const { answer: personalAnswer, intent } = answerQuestion(message);
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Keep personal-profile answers grounded in the verified knowledge base.
    if (intent !== "unknown") {
      if (!apiKey) return NextResponse.json({ answer: personalAnswer, intent, source: "knowledge-base", sources: [] });
      const prompt = `You are Sunanda Rout's Personal AI. Answer using ONLY these verified facts. Do not invent, infer, or add facts. Be concise and natural.\n\nVERIFIED FACTS:\n${personalAnswer}\n\nQUESTION:\n${message}`;
      const result = await callOpenRouter(prompt, apiKey);
      return NextResponse.json({ answer: result.text || personalAnswer, intent, source: "knowledge-base+openrouter", sources: result.sources });
    }

    if (!apiKey) {
      return NextResponse.json({ answer: "OpenRouter is not configured yet. Add OPENROUTER_API_KEY to Vercel Environment Variables.", intent, source: "knowledge-base", sources: [] });
    }

    const prompt = `You are Sunanda Rout's helpful Personal AI assistant. Answer the user's question clearly and accurately. You can answer general questions, coding questions, technology questions, and current-information questions when the selected model has web/search capability. Never claim you searched the web unless the model actually provides sources. If the question is about Sunanda personally, use only this verified context and never invent details.\n\nVERIFIED PERSONAL CONTEXT:\n${JSON.stringify(KNOWLEDGE.personal)}\n\nQUESTION:\n${message}`;
    const result = await callOpenRouter(prompt, apiKey);
    return NextResponse.json({ answer: result.text || "I couldn't generate an answer right now.", intent, source: "openrouter", sources: result.sources });
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json({ error: "Something went wrong processing your question." }, { status: 500 });
  }
}

async function callOpenRouter(prompt: string, apiKey: string): Promise<{ text: string; sources: Source[] }> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://srout-ai.vercel.app",
      "X-Title": "Sunanda Rout Personal AI",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("OpenRouter API error", res.status, detail);
    throw new Error(`OpenRouter API returned ${res.status}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  const sources: Source[] = [];
  const annotations = data?.choices?.[0]?.message?.annotations || [];
  for (const annotation of annotations) {
    const url = annotation?.url_citation?.url;
    const title = annotation?.url_citation?.title;
    if (url && !sources.some((s) => s.url === url)) sources.push({ title: title || url, url });
  }
  return { text, sources: sources.slice(0, 8) };
}
