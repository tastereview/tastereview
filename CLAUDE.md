# BiteReview - Project Documentation

## Overview

BiteReview is a B2B SaaS application for restaurants to collect customer feedback via QR codes. The core value proposition: capture feedback privately, funnel happy customers to public review platforms (Google, Instagram, etc.), and keep negative feedback internal for improvement.

**Business Model:** €39/month, 7-day free trial, single plan (MVP)

**Language:** Italian only (MVP)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Payments | Stripe (Checkout + Customer Portal) |
| Hosting | Vercel |
| Version Control | GitHub (auto-deploy to Vercel) |
| UI Components | shadcn/ui + tweakcn theme |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| QR Generation | qrcode (with PDF export via jspdf) |
| Unique IDs | nanoid |

---

## Architecture

### Route Structure

```
/                           → Landing page (public)
/login                      → Owner login
/signup                     → Owner registration
/onboarding                 → Post-signup restaurant setup
/dashboard                  → Main dashboard (protected)
/dashboard/feedback         → List of all feedback submissions
/dashboard/form-builder     → Create/edit feedback form
/dashboard/qr-codes         → Generate and download QR codes
/dashboard/settings         → Restaurant settings, social links
/dashboard/billing          → Stripe Customer Portal redirect

/r/[restaurantSlug]/[formId]           → Redirect to /1
/r/[restaurantSlug]/[formId]/[index]   → Question at index N
/r/[restaurantSlug]/[formId]/reward    → Reward screen + social buttons
```

### Component Architecture (Customer Feedback Flow)

```
/r/[restaurantSlug]/[formId]/[index]/page.tsx (Server Component)
  └── FeedbackLayout.tsx
        └── QuestionPageClient.tsx (Client Component)
              ├── ProgressBar.tsx
              ├── AnimatedQuestion.tsx (Framer Motion wrapper)
              │     └── QuestionScreen.tsx
              │           └── FieldRenderer.tsx
              │                 ├── SentimentField.tsx (Bad/Ok/Great)
              │                 ├── StarRatingField.tsx (1-5 stars)
              │                 ├── OpenTextField.tsx
              │                 ├── MultipleChoiceField.tsx
              │                 └── SingleChoiceField.tsx
              └── NavigationButtons.tsx
```

### Form Builder (Dashboard)

```
/dashboard/form-builder/page.tsx
  └── FormBuilderClient.tsx
        ├── TemplateSelector.tsx (2 default templates)
        ├── QuestionList.tsx (@dnd-kit sortable)
        │     └── QuestionItem.tsx (draggable)
        ├── QuestionEditor.tsx (side panel)
        └── AddQuestionMenu.tsx
```

---

## Database Schema (Supabase)

### Tables

```sql
-- Restaurant owners
restaurants (
  id uuid PRIMARY KEY,
  owner_id uuid REFERENCES auth.users,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  google_business_url text,
  instagram_handle text,
  tripadvisor_url text,
  facebook_url text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text DEFAULT 'trialing',
  trial_ends_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- Feedback forms (one per restaurant for MVP, but structured for multiple)
forms (
  id uuid PRIMARY KEY,
  restaurant_id uuid REFERENCES restaurants,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  reward_text text,
  created_at timestamptz DEFAULT now()
)

-- Form questions
questions (
  id uuid PRIMARY KEY,
  form_id uuid REFERENCES forms,
  type text NOT NULL, -- 'sentiment', 'star_rating', 'open_text', 'multiple_choice', 'single_choice'
  label text NOT NULL,
  description text,
  is_required boolean DEFAULT true,
  options jsonb, -- for multiple_choice and single_choice
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- Feedback submissions
submissions (
  id uuid PRIMARY KEY,
  form_id uuid REFERENCES forms,
  table_identifier text, -- for future QR-per-table feature
  overall_sentiment text, -- 'bad', 'ok', 'great'
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- Individual answers
answers (
  id uuid PRIMARY KEY,
  submission_id uuid REFERENCES submissions,
  question_id uuid REFERENCES questions,
  value jsonb NOT NULL, -- flexible: string, number, array
  created_at timestamptz DEFAULT now()
)
```

### Row Level Security (RLS)

- `restaurants`: Owner can only access their own restaurant
- `forms`, `questions`: Owner can only access forms/questions for their restaurant
- `submissions`, `answers`: Owner can read submissions for their restaurant; public can insert (no auth required)

---

## Key Features

### 1. Customer Feedback Flow (Typeform-style)
- One question per screen, full-screen centered layout
- Framer Motion slide animations (right-to-left on next, left-to-right on back)
- Progress bar with percentage
- Auto-save answer on navigation
- Mobile-first design (QR scanned from phone)

### 2. Form Builder
- 2 default templates:
  - **Quick & Simple:** Overall sentiment + open comment (2 questions)
  - **Detailed Feedback:** Overall sentiment + food rating + service rating + open comment (4 questions)
- Custom form creation with drag & drop reordering (@dnd-kit)
- Max 6 questions per form
- Block types:
  - Sentiment (Bad/Ok/Great with icons)
  - Star Rating (1-5 stars)
  - Open Text (textarea)
  - Multiple Choice (checkboxes)
  - Single Choice (radio buttons)

### 3. QR Code Generation
- Library: `qrcode`
- Encodes URL: `https://[domain]/r/[restaurantSlug]/[formId]`
- MVP: PDF download only
- Future: customization (colors, logo in center), PNG/SVG export

### 4. Reward Screen
- Displayed after form completion
- Custom text set by owner (e.g., "Mostra questo schermo al cameriere per un limoncello gratis!")
- Confetti animation (canvas-confetti or similar)
- Social buttons logic:
  - If overall_sentiment === 'great': Show Google, Instagram, TripAdvisor, Facebook buttons
  - If overall_sentiment === 'ok' or 'bad': Show only reward, no review buttons

### 5. Dashboard
- Feedback list with basic filters (date range, sentiment)
- Simple stats: total submissions, sentiment breakdown (pie chart or simple numbers)
- No email notifications (MVP)
- No CSV export (MVP)

### 6. Payments (Stripe)
- 7-day free trial (no card required to start)
- €39/month single plan
- Stripe Checkout for payment
- Stripe Customer Portal for subscription management
- Webhook handling for subscription events

---

## Development Rules

### MANDATORY - Read on Every Session
1. **Always read TODO.md first** and follow it for implementations
2. **Mark tasks as complete** in TODO.md when done

### Code Quality
- **No hacky solutions** - If something feels like a workaround, stop and find the proper solution
- **No workarounds** - Address root causes, not symptoms
- **Clean code** - Readable, well-structured, properly typed
- **Double check everything** - Verify logic, test edge cases
- **Never assume** - When unsure, verify in documentation or ask

### Architecture Rules
- **Server Components by default** - Only use Client Components when interactivity is needed
- **Colocation** - Keep related files together (components, hooks, utils for a feature in the same folder)
- **Type everything** - No `any` types unless absolutely necessary with a comment explaining why
- **Error handling** - Always handle errors gracefully, show user-friendly messages
- **Loading states** - Every async operation needs a loading state
- **Optimistic updates** - Where appropriate for better UX

### File Conventions
- **Components:** PascalCase (`QuestionScreen.tsx`)
- **Utilities/hooks:** camelCase (`useFormBuilder.ts`)
- **Pages:** lowercase with hyphens (`form-builder/page.tsx`)
- **Types:** Suffix with `.types.ts` or in a `types/` folder

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep messages concise but descriptive

### Testing Approach
- Manual testing for MVP
- Focus on critical paths: signup flow, form completion, payment flow

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Third-Party Integrations

### Stripe Webhook Events to Handle
- `checkout.session.completed` - Activate subscription
- `customer.subscription.updated` - Update status
- `customer.subscription.deleted` - Handle cancellation
- `invoice.payment_failed` - Handle failed payment

### Social Platform Deep Links
- **Google Reviews:** `https://search.google.com/local/writereview?placeid=[PLACE_ID]`
- **Instagram:** `https://instagram.com/[HANDLE]`
- **TripAdvisor:** Direct URL to restaurant page
- **Facebook:** Direct URL to restaurant page

---

## Future Features (Post-MVP)
- Multiple QR codes per table with table tracking
- QR customization (colors, logo)
- Email notifications for new feedback
- CSV export
- Multi-user access (staff accounts)
- Multiple pricing tiers
- English language support
- Analytics dashboard with trends
- Image upload for reward screen
