import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

// Allowlist of editable knowledge files — never allow arbitrary paths.
const ALLOWED_FILES = [
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

type FileName = (typeof ALLOWED_FILES)[number];

function isAllowed(file: string): file is FileName {
  return (ALLOWED_FILES as readonly string[]).includes(file);
}

function dataPath(file: FileName) {
  return path.join(process.cwd(), "src", "data", `${file}.json`);
}

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!(await requireAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const file = req.nextUrl.searchParams.get("file");
  if (!file || !isAllowed(file)) {
    return NextResponse.json({ error: "Unknown or missing 'file' parameter." }, { status: 400 });
  }

  const raw = await fs.readFile(dataPath(file), "utf-8");
  return NextResponse.json({ file, content: JSON.parse(raw) });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { file, content } = await req.json();
  if (!file || !isAllowed(file)) {
    return NextResponse.json({ error: "Unknown or missing 'file'." }, { status: 400 });
  }
  if (content === undefined) {
    return NextResponse.json({ error: "Missing 'content'." }, { status: 400 });
  }

  try {
    // Validate it's serializable/valid JSON shape before writing.
    const serialized = JSON.stringify(content, null, 2);
    await fs.writeFile(dataPath(file), serialized + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to write file. Note: on Vercel's serverless runtime the filesystem is read-only in production — use the Supabase-backed version described in the README for live editing." }, { status: 500 });
  }
}
