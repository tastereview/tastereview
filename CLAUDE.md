# 5stelle - Development Guide

## Project

**5stelle** — B2B SaaS for restaurants to collect customer feedback via QR codes. Happy customers get funneled to public review platforms; negative feedback stays private. Italian only (MVP).

| Layer | Tech |
|-|-|
| Framework | Next.js 14+ App Router (RSC default) |
| Language | TypeScript (strict) |
| UI | shadcn/ui + Tailwind + Framer Motion |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | Stripe (Checkout + Customer Portal) |
| Hosting | Vercel (auto-deploy from GitHub) |
| Package manager | npm |

**Key files:**
- `TODO.md` — Task tracking. Read first every session, mark tasks done after implementation
- `ARCHITECTURE.md` — Route map, component trees, DB schema, integration details
- `src/types/` — TypeScript types and database types

---

## Critical Rules

### 1. Follow TODO.md
- **Read `TODO.md` at the start of every session** — it defines what to work on
- Mark tasks complete (`[x]`) after implementation
- Don't work on things not in TODO.md without asking

### 2. Understand Before You Change
- Read all related code before modifying anything
- Search the codebase (`grep`) for all usages of a field/component before editing
- Ask yourself: "Will this change break something that currently works?"
- If unsure about something, verify in the code or ask — never assume

### 3. Code Quality
- Fix root causes, not symptoms. No workarounds, no hacky solutions
- Change only what needs to change — surgical precision
- No `any` types unless absolutely necessary (with a comment explaining why)
- After any code change, run `npx tsc --noEmit` to catch type errors before considering the task done

### 4. Error Handling
- Every Supabase query: always check `{ data, error }`, show user-facing feedback on failure
- Every async operation needs a loading state
- When a save/submit fails, preserve the user's form data — never lose input
- Never let a failure result in a blank screen or silent data loss

### 5. RLS Policies
- New table → enable RLS + create policies
- `restaurants`, `forms`, `questions`: owner access only (via `owner_id`)
- `submissions`, `answers`: owner can read, public can insert (no auth required for customers)

### 6. UI Consistency
- Reuse existing components from `@/components/ui` — never create custom replacements
- Server Components by default — Client Components only when interactivity is needed
- No unsolicited UI/design changes. Ask first

---

## Business Logic

- **Feedback flow:** One question per screen, mobile-first, Framer Motion transitions
- **Sentiment routing:** If `overall_sentiment === 'great'` → show social review buttons. If `'ok'` or `'bad'` → show only reward, no review buttons
- **Forms:** Max 6 questions per form. Types: `sentiment`, `star_rating`, `open_text`, `multiple_choice`, `single_choice`
- **Payments:** 7-day free trial (no card), €39/month single plan, Stripe Checkout + Customer Portal
- **Subscription statuses:** `trialing`, `active`, `canceled`, `past_due`

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/login, signup    # Auth pages
│   ├── onboarding/             # Post-signup restaurant setup
│   ├── dashboard/              # Protected owner area
│   │   ├── feedback/           # Submission list + filters
│   │   ├── form-builder/       # Create/edit feedback forms
│   │   ├── qr-codes/           # QR generation + PDF download
│   │   ├── settings/           # Restaurant settings, social links
│   │   └── billing/            # Stripe portal redirect
│   ├── r/[slug]/[formId]/      # Public customer feedback flow
│   └── api/                    # API routes (auth, webhooks)
├── components/
│   ├── ui/                     # shadcn base components
│   ├── feedback/               # Customer-facing feedback components
│   ├── form-builder/           # Dashboard form builder components
│   └── shared/                 # Reusable across features
├── hooks/
├── lib/
│   ├── supabase/               # Client + server + admin clients
│   └── utils/
└── types/
```

---

## Workflow Rules

### Git
- **Never run git commands** — only provide commit messages when asked
- Format: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` — concise but descriptive

### Development
- **Never run `npm run dev`** — user has a dev server running
- Develop incrementally — small testable steps, let user verify between steps
- Clean up test files after user confirms they work

### File Conventions
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Pages: `lowercase-hyphens/page.tsx`

---

## Context Efficiency
- Read files with purpose. Use grep to locate sections before reading large files
- Never re-read a file already read in this session
- For files over 500 lines, read only the relevant section
- Don't echo back file contents or narrate tool calls
- Keep explanations proportional to complexity