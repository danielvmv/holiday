# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jolidays is a privacy-focused Secret Santa website for a family trip to Riviera Nayarit (Dec 22-29, 2026). It generates a constrained gift exchange assignment and provides unique, non-guessable links for each participant to view only their assignment.

**Critical Privacy Architecture:** Each reveal page (`/r/[slug]`) is statically generated with ONLY that person's assignment data. The full assignment mapping never exists in client-side code—this is enforced by Next.js SSG with `generateStaticParams()`.

## Reglas críticas — no modificar sin confirmación explícita
- El sorteo YA fue generado y validado. NO lo regeneres a menos que se pida explícitamente.
- Cada página individual (/r/[slug]) debe incluir SOLO el dato de esa persona.
  Nunca expongas el JSON completo de las 9 asignaciones en ninguna página pública ni en el bundle del cliente.
- No agregar tope de precio ni fecha límite de compra — es intencional.
- Fecha del intercambio: 24 de diciembre 2026. No cambiar sin confirmación.
- Deploy target: Vercel.


## Commands

```bash
# Development
npm run dev                 # Start dev server on localhost:3000

# Building
npm run build               # Runs prebuild script + builds static site
npm run start               # Serve production build locally

# Assignment Generation
npm run generate            # Check/generate assignments (idempotent)
npm run generate:force      # ⚠️ Regenerate ALL assignments (changes all slugs)

# Linting
npm run lint
```

## Architecture

### Build-Time Assignment Generation

The `prebuild` script (`scripts/generate-assignments.ts`) runs before every build:

1. **Idempotent by default:** If `data/assignments.json` exists, skips generation (preserves existing slugs)
2. **Force regeneration:** Use `--force` flag to regenerate (⚠️ invalidates all existing links)
3. **Constraint validation:** Uses backtracking algorithm to generate a valid derangement:
   - No self-assignments
   - Excluded pairs (bidirectional): couples (Victor↔Lizzeta, Marcela↔Daniel, Ulani↔Ricardo)
   - Excluded pairs (bidirectional): parent-child relationships (Victor/Lizzeta with Jose/Juan; Marcela/Daniel with Ulani)
   - Siblings (Jose/Juan) CAN be assigned to each other
   - Thelma (abuela) has no restrictions

4. **Outputs:**
   - `data/assignments.json` (committed to git, used by SSG)
   - `data/PRIVATE_LINKS.md` (gitignored, for manual distribution)

### Static Site Generation (SSG)

**Next.js 16 App Router** with full static export:

- `app/page.tsx`: Landing page with countdown to Dec 24, 2026 8PM MST
- `app/r/[slug]/page.tsx`: Dynamic route that pre-generates 9 static pages via `generateStaticParams()`
  - Imports `data/assignments.json` at build time
  - Each generated page includes ONLY the giver/receiver pair for that slug
  - No runtime database or API—everything is build-time static

### Privacy Implementation Details

**Why this is secure:**

1. Next.js SSG generates individual HTML files per slug (e.g., `/r/4NNBu648.html`)
2. Each file's React props contain only `{giver: {...}, receiver: {...}, slug: "..."}` for that assignment
3. The full `assignments.json` is NOT bundled into the client JavaScript
4. Inspecting browser DevTools or page source reveals only the current person's assignment
5. Slugs are cryptographically random (6 bytes base64url, ~281 trillion possibilities)

### Check-In System (Separate from Assignments)

**IMPORTANT:** This system is completely isolated from the secret assignment logic.

**Purpose:** Social check-in page (`/join`) where participants confirm they're ready BEFORE secret links are distributed.

**Architecture:**
- `lib/participants.ts`: Shared source of truth for participant names (used by both assignment generation and check-in)
- `app/api/checkin/route.ts`: Dynamic API routes (POST/GET) using Vercel KV for state
  - POST: Validates participantId against whitelist, saves to KV as `checkin:{id}` → `{timestamp}`
  - GET: Returns status of all 9 participants (checked in yes/no + timestamp)
  - **ZERO dependency on `data/assignments.json`** — only tracks participation, not gift assignments
- `app/join/page.tsx`: Public page showing:
  - Group progress (X/9 confirmed)
  - List of all participants with ✅ (checked in) or ⏳ (pending)
  - Dropdown to select own name + confirmation button
  - Polls API every 5 seconds for live updates
  - LocalStorage prevents accidental double check-ins

**Environment Variables Required:**
```
KV_REST_API_URL=...      # From Vercel KV dashboard
KV_REST_API_TOKEN=...    # From Vercel KV dashboard
```

**Deployment Note:** This requires Vercel (or compatible platform with KV). The `/r/[slug]` pages remain fully static; only `/api/checkin` and `/join` are dynamic.

### Styling

**Tailwind CSS 4** with custom tropical-Christmas color palette (defined in `app/globals.css`):
- Ocean: `#0891B2`, `#22D3EE`
- Sand: `#FEF3C7`, `#FDE68A`
- Christmas: `#DC2626` (red), `#F59E0B` (gold)
- Palm: `#059669`

Fonts: Poppins (display/headings), Inter (body)

## Modifying Participants or Constraints

**File:** `scripts/generate-assignments.ts`

1. Update `participants` array (lines 19-29)
2. Update `constraints` array (lines 32-45) for new exclusion rules
3. Run `npm run generate:force` to regenerate with new rules
4. Commit updated `data/assignments.json`
5. Rebuild and redeploy

**⚠️ Warning:** Changing participants/constraints after distributing links will invalidate all existing URLs.

## Adding Family Photos

1. Place images in `public/photos/`
2. Edit `app/page.tsx` in the "Photo gallery" section
3. Replace placeholder divs with Next.js `Image` components:

```tsx
<Image
  src="/photos/family-photo.jpg"
  alt="Description"
  width={600}
  height={600}
  className="w-full h-full object-cover"
/>
```

## Deployment (Vercel)

The site is configured for Vercel with zero configuration:

1. Push to GitHub
2. Import in Vercel dashboard
3. Vercel auto-detects Next.js, runs `npm run build` (includes prebuild)
4. Expected domain: `jolidays.vercel.app`

**Important:** `data/PRIVATE_LINKS.md` is gitignored. After deployment, retrieve it from your local machine and distribute links manually via WhatsApp.

## Data Files

- `data/assignments.json`: Committed to git, required for build
- `data/PRIVATE_LINKS.md`: Gitignored (contains sensitive URLs), generated locally

Do NOT commit `PRIVATE_LINKS.md` to version control.
