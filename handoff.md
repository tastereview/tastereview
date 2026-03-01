# Session Handoff — 2026-03-01

## What Was Done

### 1. "Anteprima" Preview Button
**Files:** `src/app/(dashboard)/dashboard/form-builder/page.tsx`, `src/app/(dashboard)/dashboard/qr-codes/page.tsx`

Added an "Anteprima" button (outline, sm, ExternalLink icon) next to the h1 on both form-builder and qr-codes pages. Opens `/r/[slug]/[formId]` in a new tab. Only rendered when a form exists.

### 2. Signed Preview Mode (No DB Writes)
**Files:** `src/lib/preview-token.ts` (new), `src/app/r/[restaurantSlug]/[formId]/page.tsx`, `src/app/r/[restaurantSlug]/[formId]/[index]/page.tsx`, `src/components/feedback/QuestionPageClient.tsx`

Preview URLs include a signed HMAC token (`?preview=<sig>.<timestamp>`) generated server-side using `SUPABASE_SERVICE_ROLE_KEY` as the secret. Tokens expire after 1 hour.

**Flow:**
- Dashboard pages call `generatePreviewToken(formId)` to build the URL
- Entry redirect page (`/r/[slug]/[formId]/page.tsx`) forwards the `preview` param
- Question page server component (`[index]/page.tsx`) calls `verifyPreviewToken(formId, token)` — only sets `isPreview=true` if signature is valid and not expired
- `QuestionPageClient` receives `isPreview` + raw `previewToken`:
  - When `isPreview=true`: `saveAnswer()` only writes to sessionStorage, `handleNext()` skips the `completed_at` update
  - The token is forwarded through all navigation URLs (next/back/reward)
- A customer adding `?preview=true` or a random value to the URL gets normal submission mode (token verification fails)

### 3. Trial Expiration Warning Banner
**Files:** `src/components/dashboard/TrialExpirationBanner.tsx` (new), `src/app/(dashboard)/layout.tsx`

- Layout computes `trialDaysRemaining` from `restaurant.subscription_status === 'trialing'` + `restaurant.trial_ends_at`
- Banner renders above `{children}` (outside padding wrapper, full-width) when ≤3 days remain
- Amber state (1–3 days): dismissible via X button, local state (resets on navigation — intentional)
- Red state (≤0 / expired): not dismissible
- Messages: "scade domani" (1 day), "scade tra X giorni" (2–3), "è scaduta" (expired)
- "Abbonati ora" link to `/dashboard/billing`

### 4. Quick-Start Checklist for Empty Dashboards
**Files:** `src/components/dashboard/QuickStartChecklist.tsx` (new), `src/app/(dashboard)/dashboard/page.tsx`

Shows when `stats.total === 0` (no completed submissions yet). Disappears automatically when first feedback arrives (server-side condition).

**3 items:**
1. "Personalizza il modulo con le domande che contano" → `/dashboard/form-builder` — ✓ when form exists AND has questions (count query via `select('*', { count: 'exact', head: true })`)
2. "Configura i link social collegando i tuoi canali" → `/dashboard/settings` — ✓ when `restaurant.social_links` has at least one non-empty value
3. "Condividi il QR code e ottieni il primo feedback" → `/dashboard/qr-codes` — always unchecked (the checklist disappears before this could be checked)

**UI:** Card with `border-primary/20 bg-primary/5`, Progress bar at top, staggered Framer Motion entrance (0.12s stagger), spring-animated green check circles. Dismiss X button persists via `localStorage` key `quickstart_dismissed`.

### 5. Brand Rename + Minor Fixes (pre-existing uncommitted changes)
- `CLAUDE.md`, `TODO.md`, `architecture.md`: BiteReview → TasteReview
- `BillingClient.tsx`: BiteReview → TasteReview in UI copy
- `FeedbackDetailDialog.tsx`: Added error handling for answers/questions data loading

---

## Architecture Decisions

- **Preview token uses `SUPABASE_SERVICE_ROLE_KEY`** as HMAC secret — no new env var needed. This key is only available server-side (never exposed to client).
- **Preview verification happens server-side** in the question page RSC. The client only receives a boolean `isPreview` and the raw token string (for forwarding in URLs).
- **Quick-start checklist uses localStorage** for dismiss (not DB) — it's a low-stakes UI preference, not worth a schema change.
- **Trial banner uses component state** for dismiss — intentionally resets on navigation so the warning stays visible.

---

## Known Limitations / Future Considerations

- **Preview token TTL is 1 hour** — if a restaurant owner leaves the preview tab open longer, subsequent page navigations will fall back to normal submission mode. The TTL is in `src/lib/preview-token.ts` (`TOKEN_TTL_MS`).
- **"Scarica il QR code" checklist item** is never marked done — we intentionally left it as a CTA since the checklist disappears once first feedback arrives anyway. If we wanted to track it, we'd need a DB column or localStorage flag.
- **Trial banner only shows for `trialing` status** — if `subscription_status` is something else (e.g. `past_due`), no banner shows. This could be extended later.

---

## Files Changed (Summary)

| File | Change |
|------|--------|
| `src/lib/preview-token.ts` | **NEW** — HMAC token generate/verify |
| `src/components/dashboard/TrialExpirationBanner.tsx` | **NEW** — Trial warning banner |
| `src/components/dashboard/QuickStartChecklist.tsx` | **NEW** — Empty dashboard checklist |
| `src/app/(dashboard)/dashboard/form-builder/page.tsx` | Added preview button + token |
| `src/app/(dashboard)/dashboard/qr-codes/page.tsx` | Added preview button + token |
| `src/app/(dashboard)/layout.tsx` | Added trial banner rendering |
| `src/app/(dashboard)/dashboard/page.tsx` | Added checklist queries + rendering |
| `src/app/r/[restaurantSlug]/[formId]/page.tsx` | Forward preview param |
| `src/app/r/[restaurantSlug]/[formId]/[index]/page.tsx` | Verify preview token |
| `src/components/feedback/QuestionPageClient.tsx` | Preview mode: skip DB writes |
| `CLAUDE.md`, `TODO.md`, `architecture.md` | BiteReview → TasteReview |
| `src/components/dashboard/BillingClient.tsx` | BiteReview → TasteReview |
| `src/components/dashboard/FeedbackDetailDialog.tsx` | Error handling fix |
