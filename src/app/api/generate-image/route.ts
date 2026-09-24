import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

function extractGeneratedImage(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  for (const part of parts) {
    const inline = part?.inlineData || part?.inline_data;
    if (inline?.data) {
      return `data:${inline.mimeType || inline.mime_type || "image/png"};base64,${inline.data}`;
    }
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

    const parts: Array<Record<string, any>> = [
      {
        text: hasImage
          ? `${prompt}\n\nEdit the uploaded image according to the instruction. Preserve the person's identity, facial features, and important details unless the prompt explicitly asks to change them. Return the edited image.`
          : prompt,
      },
    ];

    if (hasImage) {
      const bytes = Buffer.from(await file.arrayBuffer());
      parts.push({
        inline_data: {
          mime_type: file.type || "image/jpeg",
          data: bytes.toString("base64"),
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ["IMAGE"],
          },
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Gemini image API error", response.status, detail);
      return NextResponse.json(
        { error: `Gemini image request failed (${response.status}). Check GEMINI_API_KEY, billing/free-tier access, and GEMINI_IMAGE_MODEL.` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const image = extractGeneratedImage(data);

    if (!image) {
      console.error("Gemini returned no image", JSON.stringify(data).slice(0, 4000));
      return NextResponse.json(
        { error: "Gemini returned no image. Try a simpler edit prompt or check that your API key has access to the image model." },
        { status: 502 }
      );
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error("/api/generate-image error", error);
    return NextResponse.json({ error: "Something went wrong generating the image." }, { status: 500 });
  }
}
