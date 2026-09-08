# Sunanda Rout — Personal AI Website

A premium personal site with a retrieval-based "Personal AI" that answers questions about
Sunanda Rout **only** from a structured, editable knowledge base — never inventing facts.

## What's actually in this build vs. what needs your input

You attached the project brief as text, but no resume PDF, certificate images, LinkedIn
screenshots, or profile photo actually came through as files. So this build:

- **Is fully seeded** with everything given in the brief's resume text (education, the two
  internships, all 8 projects, skills).
- **Leaves clearly-marked placeholders** for anything not provided: date of birth, address,
  phone, GitHub/LinkedIn URLs, certificates, the Riseflake / Student Brand Ambassador role
  (mentioned in the brief but with no dates or details), current learning topics, and career
  goals. The AI will honestly say "I don't have that information yet" for these until you add
  them — it will never guess.
- **Has no real photo/certificate images.** Add them to `/public` and reference them from the
  admin panel once you have the files.

This is intentional: the whole point of the brief was "never invent personal information," so
the safest thing to ship is a working system with honest gaps, not a filled-in mockup.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Personal AI**: local JSON knowledge base + rule-based retrieval (`src/lib/knowledge.ts`).
  Works with zero external services. Optionally rephrases the retrieved answer through the
  OpenAI API if you add a key — but the LLM is never allowed to add facts, only reword what
  retrieval already found.
- **Admin panel**: password-protected, edits the JSON knowledge base directly.
- **Deployment target**: Vercel.

### Why not Supabase / a vector DB out of the box?

The brief suggested Supabase + RAG. For a knowledge base this size (a handful of JSON files,
not thousands of documents), a vector DB is overkill and adds real fragility for no benefit —
the rule-based retrieval in `knowledge.ts` is exhaustive over the whole dataset every time, so
it's more accurate than approximate vector search would be here. The trade-off: **the built-in
admin panel writes directly to files on disk**, which works great in local development but
**will fail on Vercel's read-only production filesystem.** Two ways to handle that:

1. **Simplest**: edit the JSON files in `src/data/` directly in your code editor and redeploy.
   No database needed, ever.
2. **If you want live in-browser editing on production**: swap the file reads/writes in
   `src/app/api/admin/data/route.ts` and `src/lib/knowledge.ts` for Supabase table
   reads/writes. The shape of the code (one function per resource) makes this a same-day swap.

## Project structure

```
src/
  app/
    page.tsx                  → homepage (assembles all sections)
    layout.tsx                → fonts, metadata, SEO
    globals.css
    api/
      chat/route.ts           → POST { message } → { answer } — the AI endpoint
      admin/auth/route.ts     → login/logout (sets a signed session cookie)
      admin/data/route.ts     → GET/PUT knowledge base JSON files (auth required)
    admin/
      page.tsx                → admin dashboard (edit JSON per section)
      login/page.tsx          → admin login form
    middleware.ts             → protects /admin/* routes
  components/                 → one component per website section
  data/                       → the knowledge base — THE source of truth
    personal.json  education.json  experience.json  projects.json
    skills.json  certifications.json  achievements.json
    learning.json  links.json
  lib/
    knowledge.ts              → intent detection + retrieval, used by the chat API
    auth.ts                   → admin session signing/verification
```

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local: set ADMIN_PASSWORD and ADMIN_SESSION_SECRET at minimum.
# Generate a secret with: openssl rand -hex 32
npm run dev
```

Open http://localhost:3000. The Personal AI works immediately with no API key. Visit
http://localhost:3000/admin to log in and edit the knowledge base — changes save to the JSON
files in `src/data/` and are reflected by the AI on the next question (no restart needed).

## Adding your real content

1. **Photo**: drop it in `/public/photo.jpg` and reference it from `personal.json`'s
   `photoUrl` field, then have `Hero.tsx` render it with `next/image`.
2. **Resume PDF**: replace `/public/resume.pdf` (currently missing — the download button in
   the Resume section links here).
3. **Certificates**: add entries to `certifications.json` via the admin panel, and drop
   certificate images into `/public/certificates/`.
4. **GitHub/LinkedIn**: fill in `links.json`.
5. **Riseflake / Student Brand Ambassador**: once you have dates and a certificate, fill in
   the `riseflake` entry in `experience.json` and flip `verified` to `true` — it will then
   show up on the timeline and in AI answers like any other role.

## Enabling the OpenAI rephrasing layer (optional)

Set `OPENAI_API_KEY` in `.env.local` (or your Vercel project's environment variables). The
chat API will then send the already-retrieved factual answer to `gpt-4o-mini` with a strict
system prompt forbidding it from adding anything not in that answer, and use the rephrased
version if the call succeeds. If the call fails or the key is missing, it silently falls back
to the raw knowledge-base answer — the assistant never breaks because of this.

**Never commit your API key.** It's read from environment variables only and is never sent to
the browser — the OpenAI call happens entirely in `src/app/api/chat/route.ts`, a server-side
route.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `OPENAI_API_KEY` (optional)
4. Deploy.
5. Remember: the admin panel's *save* action will fail in production until you either (a) edit
   JSON files locally and redeploy, or (b) wire up Supabase as described above.

## Security notes

- Admin session is a signed, `httpOnly`, `sameSite=strict` cookie — not readable or forgeable
  from client-side JS.
- `/admin/*` is blocked from search engines via `robots.txt` and protected server-side by
  `middleware.ts`, not just hidden in the UI.
- The admin data API only reads/writes an explicit allowlist of filenames — never an arbitrary
  path.
- The OpenAI key and admin password live only in server environment variables, never in
  frontend code or client bundles.
- Chat input is length-limited and validated server-side.

## Privacy notes

`personal.json` deliberately does **not** contain father's/mother's name, date of birth, full
address, or phone number — per the brief, those are private and were never given anyway. If
you want the AI to be able to discuss any private field with *you* specifically (not public
visitors), that needs a separate authenticated-only data path — it should not be added to the
public `src/data/` files at all, even marked "private," since anything in that folder is
readable by the public chat endpoint's underlying code if the retrieval logic is ever extended
carelessly. Keep genuinely private data out of this repo entirely.
