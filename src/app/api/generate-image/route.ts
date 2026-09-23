import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Image generation is not configured. Add OPENAI_API_KEY to Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const hasImage = file instanceof File && file.size > 0;
    if (hasImage && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 400 });
    }

    let response: Response;

    if (hasImage) {
      const body = new FormData();
      body.append("model", OPENAI_IMAGE_MODEL);
      body.append("prompt", prompt);
      body.append("size", "1024x1024");
      body.append("quality", "auto");
      body.append("image", file);

      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body,
        cache: "no-store",
      });
    } else {
      response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_IMAGE_MODEL,
          prompt,
          size: "1024x1024",
          quality: "auto",
          output_format: "png",
        }),
        cache: "no-store",
      });
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("OpenAI image API error", response.status, detail);
      return NextResponse.json(
        { error: "The image generator could not process this request right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const image = data?.data?.[0]?.b64_json;

    if (!image) {
      return NextResponse.json({ error: "No image was returned by the image generator." }, { status: 502 });
    }

    return NextResponse.json({ image: `data:image/png;base64,${image}` });
  } catch (error) {
    console.error("/api/generate-image error", error);
    return NextResponse.json({ error: "Something went wrong generating the image." }, { status: 500 });
  }
}
