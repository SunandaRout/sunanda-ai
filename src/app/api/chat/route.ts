import { NextRequest, NextResponse } from "next/server";
import { answerQuestion, KNOWLEDGE } from "@/lib/knowledge";

export const runtime = "nodejs";

/**
 * IMPORTANT DESIGN DECISION:
 * The factual answer always comes from answerQuestion() (src/lib/knowledge.ts),
 * which only reads from the local JSON knowledge base. This guarantees the AI
 * can never invent facts about Sunanda, even if an LLM call below fails,
 * times out, or is not configured.
 *
 * If OPENAI_API_KEY is set, we optionally ask the model to *rephrase* the
 * already-retrieved factual answer in a warmer, more natural voice — but we
 * explicitly forbid it from adding any fact not present in that answer.
 * If no key is set (e.g. local dev without billing), the retrieval answer
 * is returned as-is, which is already a complete, correct response.
 */

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const { answer, intent } = answerQuestion(message);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ answer, intent, source: "knowledge-base" });
    }

    try {
      const rephrased = await polishWithOpenAI(message, answer, apiKey);
      return NextResponse.json({ answer: rephrased ?? answer, intent, source: "knowledge-base+llm" });
    } catch (e) {
      // LLM step is best-effort only. Never fail the request because of it.
      return NextResponse.json({ answer, intent, source: "knowledge-base" });
    }
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong processing your question." }, { status: 500 });
  }
}

async function polishWithOpenAI(question: string, factualAnswer: string, apiKey: string): Promise<string | null> {
  const system = `You are rephrasing a factual answer about a person named ${KNOWLEDGE.personal.name} for his personal website's AI assistant.
STRICT RULES:
- Only use information present in the "FACTUAL ANSWER" provided by the user message.
- Do NOT add, infer, or invent any fact, date, number, or detail not present in it.
- If the factual answer says information is unavailable, keep that meaning — do not soften it into a guess.
- Keep the tone professional, warm, and concise (2-4 sentences max).
- Speak about Sunanda in the third person.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `QUESTION: ${question}\n\nFACTUAL ANSWER: ${factualAnswer}\n\nRephrase the factual answer naturally, using only what's in it.`,
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? null;
}
