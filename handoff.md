# Session Handoff

## What was done

### Phase 10.1 — Error Handling (complete)
- **Global error boundary** (`src/app/error.tsx`) — client component, "Qualcosa è andato storto" with Riprova + Torna alla home buttons
- **Dashboard error boundary** (`src/app/(dashboard)/dashboard/error.tsx`) — AlertTriangle icon, fits inside sidebar layout
- **404 page** (`src/app/not-found.tsx`) — clean centered layout, "Torna alla home" button
- **Loading skeletons** for all dashboard routes:
  - `dashboard/loading.tsx` — 3-card stats grid + feedback list skeleton
  - `dashboard/form-builder/loading.tsx` — question cards + reward section
  - `dashboard/settings/loading.tsx` — restaurant info + social links cards
  - `dashboard/qr-codes/loading.tsx` — QR preview + tables list
- Added `shadcn Skeleton` component (`src/components/ui/skeleton.tsx`)

### Phase 10.2 — Landing Page (marked done, was built previous session)
- All tasks marked `[x]` in TODO.md

### Phase 10.4 — Legal Pages (complete)
- **Privacy Policy** (`src/app/privacy/page.tsx`) — GDPR-compliant, Italian language
  - Titolare: Miral Media di Aggio Filippo, P.IVA IT04901620262
  - Address omitted (referenced to Registro Imprese)
  - `[EMAIL]` placeholder — needs replacement when domain is purchased
  - Covers: data collected, purposes, legal bases, third parties (Supabase, Stripe, Vercel), cookies, retention, GDPR rights
- **Terms of Service** (`src/app/terms/page.tsx`) — subscription terms, liability, Foro di Treviso
  - `[EMAIL]` placeholder — same, needs replacement
- **Cookie banner** (`src/components/shared/CookieBanner.tsx`)
  - Uses `react-cookie-consent` npm package
  - Informational only (technical cookies, no consent required)
  - Styled to match app theme, links to /privacy
  - Added to root layout (`src/app/layout.tsx`)
- **Signup legal line** — "Registrandoti accetti i Termini di Servizio e la Privacy Policy" added to signup page
- Footer already had /privacy and /terms links (from landing page session)

### Landing Page Fixes
- **Star animation** (`AnimatedStars` in `src/app/page.tsx`):
  - Cycle extended from 4s → 5s
  - `repeatDelay: 0` — no gap between loops
  - Stars hold visible for 88% of cycle, fade-out is only 0.6s
  - Shimmer sweep timing adjusted to match
- **Mobile horizontal scroll** — Added `overflow-x-hidden` to root wrapper div

### Dashboard UI Overhaul
All changes use Framer Motion. No new dependencies added (already in project).

**ScoreRing** (`src/components/dashboard/ScoreRing.tsx`) — full rewrite:
- Replaced `setInterval` + manual easing with Framer Motion `useSpring` + `useTransform`
- SVG ring and number counter perfectly synced via motion values
- Added text label below number: "Eccellente" (≥80), "Buono" (≥60), "Sufficiente" (≥40), "Da migliorare" (<40)
- Added subtle radial glow behind ring in score's color
- Default size bumped 130 → 140

**Dashboard home** (`src/app/(dashboard)/dashboard/page.tsx`):
- **Riepilogo card redesigned** — removed icon circles, dividers, inconsistent sizing. Now a clean 2×2 grid: Totali | Oggi | Ultimi 7 giorni | Ultimo. Each cell is muted-bg box with label + big number.
- **Hover lift** on all 3 stat cards (`hover:-translate-y-1 hover:shadow-md`)
- Removed unused imports (MessageSquare, TrendingUp, Clock)

**FeedbackList** (`src/components/dashboard/FeedbackList.tsx`):
- Staggered entrance: items fade+slide in with 30ms stagger per row
- `AnimatePresence mode="wait"` crossfades between filter states (keyed by `${period}-${sentiment}`)
- "Rimuovi filtri" button animates in/out
- Empty state: card scales in, Inbox icon bounces with spring physics

**FeedbackDetailDialog** (`src/components/dashboard/FeedbackDetailDialog.tsx`):
- Answer items stagger in with 60ms delay each after dialog opens

**GooglePlaceIdFinder** (`src/components/dashboard/GooglePlaceIdFinder.tsx`):
- `AnimatePresence` for smooth height animation on expand/collapse
- Replaced ChevronUp/ChevronDown swap with single ChevronDown that rotates 180°

**QRCodeClient** (`src/components/dashboard/QRCodeClient.tsx`):
- Hover lift on QR code cards

**TableManager** (`src/components/dashboard/TableManager.tsx`):
- `AnimatePresence` for table add/remove (height + opacity animation)
- Empty state fades in

**SettingsClient** (`src/components/dashboard/SettingsClient.tsx`):
- Platform inputs stagger in with 40ms delay (index passed to renderPlatformInput)
- Both save buttons show checkmark "Salvato" state for 2s after success
- Added `Check` to lucide imports, `savedInfo`/`savedSocial` state vars

**QuestionItem** (`src/components/form-builder/QuestionItem.tsx`):
- Enhanced drag state: `shadow-xl scale-[1.02] ring-2 ring-primary/20 z-50` (was just `opacity-50 shadow-lg`)
- Added `hover:shadow-sm` when not dragging

**QuestionList** (`src/components/form-builder/QuestionList.tsx`):
- Wrapped items in `motion.div` with staggered entrance (50ms delay per item)
- `AnimatePresence` for smooth delete animation (slide left + fade)
- `layout` prop for smooth reorder animations
- Empty state: icon bounces in with spring physics

**RewardTextEditor** (`src/components/form-builder/RewardTextEditor.tsx`):
- "Modifiche non salvate" text animated in/out with `AnimatePresence` (slide + fade), colored amber
- Save button shows checkmark "Salvato" for 2s after success
- Textarea has `transition-shadow` for smooth focus effect

## Known issues / placeholders
- `[EMAIL]` in Privacy Policy and Terms of Service — replace with actual email when domain is purchased
- `database-schema.sql` has a minor diff (schema dump version bump + public restaurant RLS policy)

## Proposed improvements (discussed, not yet implemented)

### Bugs / Must-fix
1. **"BiteReview" in BillingClient.tsx** — lines 101, 138 still say "BiteReview" instead of "TasteReview"
2. **200-submission cap corrupts stats** — Dashboard query `.limit(200)` means stats are wrong for restaurants with >200 submissions. Counts should use DB aggregation.

### High-impact UX
3. **Empty dashboard quick-start checklist** — New users see empty cards with no guidance. Add a checklist: "Personalizza il modulo" → "Scarica il QR code" → "Condividi col tuo primo cliente". Disappears after first feedback.
4. **Trial warning outside billing** — Show trial expiration banner in sidebar or dashboard top when days remaining ≤ 3.
5. **"Preview form" button** — On QR codes page or form builder, add link to open `/r/[slug]/[formId]` in new tab.

### Nice to have
6. **Pagination / infinite scroll** on feedback list (currently loads all at once)
7. **CSV/Excel export** of feedback data
8. **Real-time updates** via Supabase subscriptions (push new submissions without refresh)
9. **Sidebar mobile animation** with Framer Motion

## Important files to read
- `CLAUDE.md` — Development rules, project structure, conventions
- `TODO.md` — Task tracking (Phases 10.1, 10.2, 10.4 are now done)
- `ARCHITECTURE.md` — Route map, DB schema, integration details

## What to work on next?
Check the proposed improvements above (items 1–5 are highest priority), then continue with:
- `TODO.md` Phase 10.3 — SEO & Meta (OpenGraph, favicon, robots.txt, sitemap)
- `TODO.md` Phase 10.5 — Final Testing
- `TODO.md` Phase 10.6 — Launch

Ask the user what they'd like to tackle next.
