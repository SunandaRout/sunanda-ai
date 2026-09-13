import { NextRequest, NextResponse } from "next/server";
import { answerQuestion, KNOWLEDGE } from "@/lib/knowledge";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

type Source = { title: string; url: string };

/** Hybrid Personal AI: verified personal knowledge + Gemini Google Search for general/current questions. */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const { answer: personalAnswer, intent } = answerQuestion(message);
    const apiKey = process.env.GEMINI_API_KEY;

    // Personal questions stay grounded in the site's verified knowledge base.
    if (intent !== "unknown") {
      if (!apiKey) {
        return NextResponse.json({ answer: personalAnswer, intent, source: "knowledge-base", sources: [] });
      }

      const prompt = `You are Sunanda Rout's Personal AI.
Answer the user's question using ONLY the VERIFIED PERSONAL FACTS below.
Do not invent, infer, update, or add facts. If the facts are insufficient, say the information is not confirmed.
Be concise, natural, professional, and speak about Sunanda in the third person.

VERIFIED PERSONAL FACTS:
${personalAnswer}

USER QUESTION:
${message}`;

      const result = await callGemini(prompt, apiKey, false);
      return NextResponse.json({
        answer: result.text || personalAnswer,
        intent,
        source: "knowledge-base+gemini",
        sources: result.sources,
      });
    }

    // General/current questions use real-time Google Search grounding.
    if (!apiKey) {
      return NextResponse.json({
        answer: "I can answer Sunanda-related questions from my verified knowledge base. For general or current web questions, configure GEMINI_API_KEY in the Vercel project environment variables.",
        intent,
        source: "knowledge-base",
        sources: [],
      });
    }

    const generalPrompt = `You are a helpful personal AI assistant on Sunanda Rout's portfolio website.
Answer the user's question clearly and accurately.
For current, recent, factual, or web-dependent questions, use Google Search grounding.
Prefer primary or official sources when available.
If the user asks about Sunanda personally, use only the verified personal context below and do not invent details.

VERIFIED PERSONAL CONTEXT:
${JSON.stringify(KNOWLEDGE.personal)}

USER QUESTION:
${message}`;

    const result = await callGemini(generalPrompt, apiKey, true);
    return NextResponse.json({
      answer: result.text || "I couldn't generate an answer right now.",
      intent,
      source: "gemini+google-search",
      sources: result.sources,
    });
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json({ error: "Something went wrong processing your question." }, { status: 500 });
  }
}

async function callGemini(
  prompt: string,
  apiKey: string,
  enableSearch: boolean,
): Promise<{ text: string; sources: Source[] }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
  };
  if (enableSearch) body.tools = [{ google_search: {} }];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Gemini API error", res.status, detail);
    throw new Error(`Gemini API returned ${res.status}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("")
    .trim() || "";

  const sources: Source[] = [];
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];
  for (const chunk of chunks) {
    const web = chunk?.web;
    if (!web?.uri) continue;
    if (!sources.some((source) => source.url === web.uri)) {
      sources.push({ title: web.title || new URL(web.uri).hostname, url: web.uri });
    }
  }
  return { text, sources: sources.slice(0, 8) };
}
