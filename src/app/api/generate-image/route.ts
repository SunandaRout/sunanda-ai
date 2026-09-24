import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const EDIT_MODEL = "fal-ai/qwen-image-edit/image-to-image";
const TEXT_MODEL = "fal-ai/qwen-image";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function runFalQueue(token: string, model: string, input: Record<string, unknown>) {
  const submitUrl = `https://router.huggingface.co/fal-ai/${model}?_subdomain=queue`;
  const submit = await fetch(submitUrl, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!submit.ok) {
    const detail = await submit.text().catch(() => "");
    console.error("Hugging Face submit error", submit.status, detail);
    throw new Error(`Hugging Face request failed (${submit.status}). Check HF_TOKEN and available credits.`);
  }

  const queued = await submit.json();
  const requestId = queued?.request_id;
  const responseUrl = queued?.response_url;
  if (!requestId || !responseUrl) throw new Error("Hugging Face did not return a request ID.");

  const parsed = new URL(responseUrl);
  const base = parsed.hostname === "router.huggingface.co"
    ? `https://${parsed.hostname}/fal-ai`
    : `${parsed.protocol}//${parsed.hostname}`;
  const modelPath = parsed.pathname;
  const query = parsed.search || "?_subdomain=queue";
  const statusUrl = `${base}${modelPath}/status/${requestId}${query}`;
  const resultUrl = `${base}${modelPath}${query}`;

  for (let attempt = 0; attempt < 100; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const statusResponse = await fetch(statusUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!statusResponse.ok) {
      const detail = await statusResponse.text().catch(() => "");
      console.error("Hugging Face status error", statusResponse.status, detail);
      throw new Error(`Hugging Face status check failed (${statusResponse.status}).`);
    }
    const status = await statusResponse.json();
    if (status?.status === "COMPLETED") break;
    if (["FAILED", "CANCELLED", "ERROR"].includes(status?.status)) {
      throw new Error("Hugging Face image generation failed. Please try again.");
    }
    if (attempt === 99) throw new Error("Image generation took too long. Please try again.");
  }

  const result = await fetch(resultUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!result.ok) {
    const detail = await result.text().catch(() => "");
    console.error("Hugging Face result error", result.status, detail);
    throw new Error(`Hugging Face result request failed (${result.status}).`);
  }
  return result.json();
}

async function imageUrlToDataUrl(url: string) {
  if (url.startsWith("data:")) return url;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not download the generated image.");
  const buffer = Buffer.from(await response.arrayBuffer());
  const mime = response.headers.get("content-type") || "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "").trim();
    const file = form.get("image");

    if (!prompt) return NextResponse.json({ error: "Image prompt is required." }, { status: 400 });
    if (prompt.length > 2000) return NextResponse.json({ error: "Image prompt is too long." }, { status: 400 });

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Hugging Face is not configured. Add HF_TOKEN in Vercel Environment Variables." }, { status: 503 });
    }

    const hasImage = file instanceof File && file.size > 0;
    if (hasImage && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 400 });
    }

    let result: any;
    if (hasImage) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const imageData = `data:${file.type || "image/jpeg"};base64,${bytes.toString("base64")}`;
      result = await runFalQueue(token, EDIT_MODEL, {
        image_url: imageData,
        prompt: `${prompt}. Preserve the person's identity, face, body proportions, and important details unless the prompt explicitly asks to change them.`,
      });
    } else {
      result = await runFalQueue(token, TEXT_MODEL, { prompt });
    }

    const imageUrl = result?.images?.[0]?.url || result?.image?.url || result?.image;
    if (!imageUrl || typeof imageUrl !== "string") {
      console.error("Hugging Face returned no image", JSON.stringify(result).slice(0, 4000));
      throw new Error("The image provider returned no image. Please try again.");
    }

    const image = await imageUrlToDataUrl(imageUrl);
    return NextResponse.json({ image });
  } catch (error) {
    console.error("/api/generate-image error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong generating the image." }, { status: 502 });
  }
}
