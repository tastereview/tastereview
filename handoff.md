# Session Handoff — 2026-03-01 (Session 3)

## What Was Done

### 1. Twitter → X Icon
**Files:** `src/components/icons/PlatformIcons.tsx`, `src/lib/constants/platforms.ts`

- Added `XIcon` with official X logo SVG (filled, `currentColor`)
- Replaced `Twitter` lucide import with `XIcon` in platforms.ts

### 2. Real Brand Icons for Review Platforms
**File:** `src/components/icons/PlatformIcons.tsx`

Replaced generic stroke-based icons with real brand SVG logos in their original colors:
- **TripAdvisor** — owl logo, `#34E0A1`
- **TheFork** — fork silhouette, `#00645a`
- **Yelp** — burst logo, `#DC0000`
- **Trustpilot** — star logo, `#00b67a` / `#005128`

User provided SVGs in `/public/platform-icons/`, converted to React components, originals deleted.

### 3. Cookie Banner Mobile Fix
**File:** `src/components/shared/CookieBanner.tsx`

- Added `contentStyle={{ flex: 1, margin: 0 }}` and `flexWrap: 'nowrap'` to prevent vertical stacking on mobile
- Shortened text to "Questo sito usa cookie tecnici."
- Button: `borderRadius: '8px'`, `fontWeight: 600`, `whiteSpace: 'nowrap'`

### 4. Auth Button Spacing
**Files:** `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/login/page.tsx`

Added `pt-6` to `<CardFooter>` in both pages — Card's `gap-6` doesn't apply between `CardContent` and `CardFooter` since they're inside a `<form>`.

### 5. Mobile Modal Spacing
**File:** `src/components/ui/dialog.tsx`

Changed `max-w-[calc(100%-2rem)]` → `max-w-[calc(100%-3rem)]` in DialogContent for 24px side padding instead of 16px on mobile.

### 6. Star Animation Enhancement
**File:** `src/app/page.tsx` — `AnimatedStars` component

- Duration: 5s → 8s
- Timing: `times: [0, 0.12, 0.92, 1]` (faster appear, later fade)
- Per-star delay: `0.15s` → `0.08s` (all 5 visible within 0.32s)
- Scale overshoot: `[0, 1.15, 1, 0]`
- Subtle static glow via `drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]`
- Removed animated `filter` property that caused rectangular clipping
- Removed `overflow-hidden` from container, added padding for glow breathing room
- Shimmer sweep adjusted to 8s cycle

### 7. Password Requirements UX
**File:** `src/app/(auth)/signup/page.tsx`

- Replaced long placeholder with `"••••••••"`
- Added `passwordFocused` state with `onFocus`/`onBlur`
- Shows live requirement checklist below password field when focused or has value
- Each requirement: gray circle when unmet → green `Check` icon when met
- 4 rules: 8+ chars, uppercase, number, special character
- Existing submit validation kept as safety net

### 8. Mobile Burger Menu Restructuring
**File:** `src/components/dashboard/Sidebar.tsx`

- Burger icon moved to the left of mobile header, restaurant name centered
- Mobile sidebar: `top-0` (full height, covers mobile header) instead of `top-16`
- Added close button (X) at top of mobile sidebar next to restaurant name
- Extracted nav links + logout into `NavLinks` and `LogoutButton` components, rendered with separate headers for mobile/desktop
- Fixed z-indexes: overlay `z-[45]`, sidebar `z-50`
- Added `Link2` nav item for new Links tab (between QR Code and Impostazioni)

### 9. QR Code Section Rework
**File:** `src/components/dashboard/QRCodeClient.tsx`

**PDF button positioning:**
- Download button now renders inside QR cards, constrained to `max-w-xs` matching the URL row width
- Uses default (black) variant for prominence
- Removed external `<div className="mt-3 flex justify-end">` wrappers

**Table management merged into QR section:**
- Removed separate `TableManager` card — everything now in a single "QR Code per Tavolo" card
- "Aggiungi Tavolo" button auto-creates tables with default name ("Tavolo 1", "Tavolo 2", etc.)
- New `TableQRCard` component with inline editable name (pencil icon to edit, auto-focuses on creation)
- Each table card has: editable name, QR code, URL/copy/open row, PDF download + delete buttons
- `AnimatePresence` for smooth add/remove animations
- Empty state with `UtensilsCrossed` icon
- `handleRenameTable` updates both `name` and `identifier` (slug) in DB
- `TableManager.tsx` is no longer imported (file still exists but unused)

### 10. Dashboard Stat Card Icons
**File:** `src/app/(dashboard)/dashboard/page.tsx`

Added right-aligned icons to the 3 stat card headers:
- "Soddisfazione complessiva" → `Activity`
- "Riepilogo" → `BarChart3`
- "Sentiment" → `Heart`

Pattern: `<div className="flex items-center justify-between"><CardTitle>…</CardTitle><Icon className="h-4 w-4 text-muted-foreground/50" /></div>`

### 11. Card Icon Pattern Unified
**Files:** `src/components/form-builder/RewardTextEditor.tsx`, `src/components/dashboard/SettingsClient.tsx`, `src/components/dashboard/LinksClient.tsx`

Changed the icon+title+subtitle card header pattern from icon-left-in-circle to icon-right-inline:
- Removed `<div className="p-2 bg-primary/10 rounded-md"><Icon /></div>` wrapper
- Now: title left, small muted icon right, description below
- Matches the stat card pattern for visual consistency across all dashboard cards

### 12. New Landing Page Sections
**File:** `src/app/page.tsx`

Three new sections added:

**a) "Pain Point → Solution"** — after Hero, before "Come funziona"
- Red pill badge "Il problema", heading "Recensioni perse ogni giorno"
- 3 colored bordered cards (red/amber/green) with white icon backgrounds
- Icons: `ShieldAlert`, `Star`, `TrendingUp`

**b) "Stats / Impact Numbers"** — after "Come funziona", before Reviews
- Pill badge "I numeri parlano", heading "L'impatto sulle recensioni"
- 3 stat cards: "70%" (primary), "1 su 3" (red), "+40%" (green)
- Colored numbers for visual impact

**c) "Perfetto per te"** — after Features, before Pricing
- 4 venue type tiles: Ristoranti, Pizzerie, Bar/Caffetterie, Hotel
- Icons: `UtensilsCrossed`, `Pizza`, `Coffee`, `Hotel`
- Empathetic Italian taglines per venue type

Section backgrounds adjusted for visual alternation (no two consecutive muted sections).

### 13. Dedicated Links Tab
**Files:** NEW `src/app/(dashboard)/dashboard/links/page.tsx`, NEW `src/components/dashboard/LinksClient.tsx`, `src/components/dashboard/SettingsClient.tsx`, `src/components/dashboard/Sidebar.tsx`

- Created `links/page.tsx` server component (same pattern as settings: auth check, fetch restaurant)
- Extracted social links state, functions, and UI from SettingsClient → new LinksClient
- SettingsClient now only contains restaurant info (name, slug)
- Sidebar nav: added `{ href: '/dashboard/links', label: 'Link', icon: Link2 }` after QR Code

### 14. Platform Removal Logic
**Files:** `src/components/dashboard/LinksClient.tsx`, `src/lib/constants/platforms.ts`

- Renamed `DEFAULT_PLATFORM_KEYS` → `INITIAL_PLATFORM_KEYS` (shown for fresh users)
- Removed `EXTRA_PLATFORM_KEYS` — all platforms are now equal
- `canRemove(key)`: checks if >1 platform in same category (`review`/`social`) is visible
- Remove (X) button shown on all platforms except the last in its category
- "Add" dropdown shows ALL non-visible platforms (not just extras)

### 15. Platform URL Domain Validation
**Files:** `src/lib/constants/platforms.ts`, `src/components/dashboard/LinksClient.tsx`

Added `allowedDomains` to Platform interface and per-platform domain patterns:
- TripAdvisor: `tripadvisor.`
- TheFork: `thefork.`, `lafourchette.`
- Yelp: `yelp.`
- Trustpilot: `trustpilot.`
- Facebook: `facebook.com`, `fb.com`
- YouTube: `youtube.com`, `youtu.be`
- LinkedIn: `linkedin.com`

New `validatePlatformValue()` function handles all validation centrally:
- **Google Place ID**: regex `/^ChIJ[A-Za-z0-9_-]{20,50}$/` — stricter than the old `startsWith('ChIJ')`
- **Handle platforms**: same `/^[a-zA-Z0-9._]{1,50}$/` + auto-strips `@`
- **URL platforms**: auto-prepends `https://` if missing protocol (accepts `www.tripadvisor.it/...`, `tripadvisor.it/...`, etc.), then validates domain against `allowedDomains`
- Returns `{ ok, value }` or `{ ok, error }` with Italian error messages

LinksClient `handleSave` now uses `validatePlatformValue()` instead of inline validation.

---

## Architecture Decisions

- **`validatePlatformValue` is centralized in platforms.ts** — single source of truth for all platform validation. Can be reused in any future context (API routes, etc.).
- **Domain validation uses substring matching** (`hostname.includes(domain)`) — handles all TLDs (.com, .it, .co.uk, etc.) and subdomains (www., it., m.).
- **URL auto-normalization** — prepends `https://` before validation and saves the normalized value, so links always work when rendered.
- **Table management merged into QR section** — eliminates the confusing separate "Gestione Tavoli" card. Tables are now managed directly alongside their QR codes.
- **`TableManager.tsx` still exists but is unused** — can be safely deleted in a cleanup pass.

---

## New Files

| File | Purpose |
|------|---------|
| `src/app/(dashboard)/dashboard/links/page.tsx` | Links page server component |
| `src/components/dashboard/LinksClient.tsx` | Social links management (extracted from SettingsClient) |

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/(auth)/login/page.tsx` | `pt-6` on CardFooter |
| `src/app/(auth)/signup/page.tsx` | `pt-6` on CardFooter, password UX checklist |
| `src/app/(dashboard)/dashboard/page.tsx` | Stat card header icons (Activity, BarChart3, Heart) |
| `src/app/page.tsx` | Star animation, 3 new landing sections, star glow fix |
| `src/components/dashboard/QRCodeClient.tsx` | PDF button in-card, table management rework |
| `src/components/dashboard/SettingsClient.tsx` | Stripped social links (now Links tab only) |
| `src/components/dashboard/Sidebar.tsx` | Burger left, full-height sidebar, close button, Links nav |
| `src/components/form-builder/RewardTextEditor.tsx` | Card header icon pattern |
| `src/components/icons/PlatformIcons.tsx` | Real brand SVGs + XIcon |
| `src/components/shared/CookieBanner.tsx` | Mobile layout fix |
| `src/components/ui/dialog.tsx` | Mobile padding (2rem → 3rem) |
| `src/lib/constants/platforms.ts` | allowedDomains, INITIAL_PLATFORM_KEYS, validatePlatformValue() |

---

## Pending Items

### Still Open (from TODO.md)
- [ ] Favicon — add to `/public` or `src/app/`
- [ ] OpenGraph image — add `/public/og-image.png` (1200x630) and uncomment in layout.tsx
- [ ] Final testing (10.5)
- [ ] Launch (10.6)
- [ ] Delete unused `src/components/dashboard/TableManager.tsx`

### Skipped for MVP (unchanged)
- Logo upload (Supabase Storage)
- Upgrade prompt if trial expired
- Middleware subscription status checks
- Block dashboard if subscription inactive
