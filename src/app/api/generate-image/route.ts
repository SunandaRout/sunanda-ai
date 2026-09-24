import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

function extractGeneratedImage(data: any) {
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  for (const step of steps) {
    const blocks = Array.isArray(step?.content) ? step.content : [];
    for (const block of blocks) {
      if (block?.type === "image" && block?.data) {
        return `data:${block.mime_type || "image/png"};base64,${block.data}`;
      }
    }
  }
  if (data?.output_image?.data) {
    return `data:${data.output_image.mime_type || "image/png"};base64,${data.output_image.data}`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "").trim();
    const file = form.get("image");

    if (!prompt) {
      return NextResponse.json({ error: "Image prompt is required." }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Image prompt is too long." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini image generation is not configured. Add GEMINI_API_KEY in Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const hasImage = file instanceof File && file.size > 0;
    if (hasImage && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 400 });
    }

    const input: Array<Record<string, string>> = [{ type: "text", text: prompt }];

    if (hasImage) {
      const bytes = Buffer.from(await file.arrayBuffer());
      input.push({
        type: "image",
        mime_type: file.type || "image/png",
        data: bytes.toString("base64"),
      });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: GEMINI_IMAGE_MODEL,
        input,
        response_format: {
          type: "image",
          mime_type: "image/png",
          aspect_ratio: "1:1",
          image_size: "1K",
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Gemini image API error", response.status, detail);
      return NextResponse.json(
        { error: "Gemini could not process this image request. Check your Gemini API key and try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const image = extractGeneratedImage(data);

    if (!image) {
      return NextResponse.json({ error: "Gemini did not return an image. Please try a different prompt." }, { status: 502 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error("/api/generate-image error", error);
    return NextResponse.json({ error: "Something went wrong generating the image." }, { status: 500 });
  }
}
