# BiteReview - Implementation Plan

> **IMPORTANT:** Read this file at the start of every new chat session. Follow tasks in order. Mark tasks as complete with `[x]` when done.

---

## Phase 1: Project Setup

### 1.1 Initialize Project
- [x] Create Next.js 14 project with App Router (`npx create-next-app@latest bitereview --typescript --tailwind --eslint --app`)
- [x] Initialize Git repository
- [x] Create GitHub repository and push initial commit (repo: tastereview)
- [ ] Connect to Vercel for automatic deployments (skipped for now)

### 1.2 Install Dependencies
- [x] Install shadcn/ui (`npx shadcn-ui@latest init`)
- [x] Install core shadcn components: button, input, card, dialog, dropdown-menu, form, label, progress, sonner (replaced toast), tabs
- [x] Install Framer Motion (`npm install framer-motion`)
- [x] Install @dnd-kit (`npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`)
- [x] Install qrcode and jspdf (`npm install qrcode jspdf @types/qrcode`)
- [x] Install nanoid (`npm install nanoid`)
- [x] Install Stripe (`npm install stripe @stripe/stripe-js`)
- [x] Install Supabase (`npm install @supabase/supabase-js @supabase/ssr`)
- [x] Install canvas-confetti (`npm install canvas-confetti @types/canvas-confetti`)
- [x] Install lucide-react for icons (`npm install lucide-react`)

### 1.3 Configure Supabase
- [x] Create Supabase project
- [x] Set up environment variables in `.env.local`
- [x] Create Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- [x] Create database tables (run SQL from CLAUDE.md schema)
- [x] Set up Row Level Security policies
- [x] Enable email/password authentication in Supabase dashboard

### 1.4 Configure Stripe
- [x] Create Stripe account (or use test mode)
- [x] Create product and price (€39/month with 7-day trial)
- [x] Set up environment variables
- [ ] Create Stripe webhook endpoint in Vercel (skipped for now)
- [ ] Configure webhook in Stripe dashboard (skipped for now)

### 1.5 Project Structure
- [x] Create folder structure:
  ```
  src/
  ├── app/
  │   ├── (auth)/
  │   │   ├── login/
  │   │   └── signup/
  │   ├── (dashboard)/
  │   │   └── dashboard/
  │   ├── r/
  │   │   └── [restaurantSlug]/
  │   │       └── [formId]/
  │   └── api/
  ├── components/
  │   ├── ui/ (shadcn)
  │   ├── auth/
  │   ├── dashboard/
  │   ├── feedback/ (customer-facing form)
  │   └── form-builder/
  ├── lib/
  │   ├── supabase/
  │   ├── stripe/
  │   └── utils/
  ├── hooks/
  └── types/
  ```
- [x] Create TypeScript types (`types/database.types.ts`, `types/forms.types.ts`)
- [ ] Apply tweakcn theme customization

---

## Phase 2: Authentication & Onboarding

### 2.1 Authentication Pages
- [x] Create login page (`/login`)
  - [x] Email/password form
  - [x] Error handling and validation
  - [x] Redirect to dashboard on success
  - [x] Link to signup
- [x] Create signup page (`/signup`)
  - [x] Email/password form with confirmation
  - [x] Error handling and validation
  - [x] Auto-login after signup
  - [x] Redirect to onboarding
- [x] Create auth middleware (protect dashboard routes)

### 2.2 Restaurant Onboarding
- [x] Create onboarding page (`/onboarding`)
  - [x] Step 1: Restaurant name
  - [x] Step 2: Create URL slug (auto-generate from name, allow edit)
  - [x] Auto-create restaurant record in database
  - [x] Auto-create default form with "Quick & Simple" template
  - [x] Redirect to dashboard

### 2.3 Auth Utilities
- [x] Create `useAuth` hook (get current user, loading state)
- [x] Create `useRestaurant` hook (get current restaurant for logged-in user)
- [x] Create sign-out functionality

---

## Phase 3: Dashboard Foundation

### 3.1 Dashboard Layout
- [x] Create dashboard layout with sidebar navigation
  - [x] Logo/brand at top
  - [x] Navigation items: Feedback, Modulo, QR Code, Impostazioni, Abbonamento
  - [x] User menu with sign out
- [x] Create responsive mobile navigation (hamburger menu)

### 3.2 Dashboard Home / Feedback List
- [x] Create feedback list page (`/dashboard` or `/dashboard/feedback`)
  - [x] Fetch submissions for restaurant
  - [x] Display in table/list format: date, overall sentiment (icon), preview of first answer
  - [x] Click to expand/view full submission
  - [x] Empty state when no submissions
- [x] Create simple stats section
  - [x] Total submissions count
  - [x] Sentiment breakdown (Great/Ok/Bad counts or percentages)

### 3.3 Submission Detail View
- [x] Create submission detail modal or slide-over
  - [x] Show all questions and answers
  - [x] Show timestamp
  - [x] Show table identifier (if present, for future feature)

---

## Phase 4: Form Builder

### 4.1 Form Builder Page
- [x] Create form builder page (`/dashboard/form-builder`)
- [x] Fetch current form and questions for restaurant
- [x] Display current form structure

### 4.2 Template Selector
- [x] Create template selector component
  - [x] "Quick & Simple" template: Overall sentiment + open comment
  - [x] "Feedback Dettagliato" template: Overall sentiment + food rating + service rating + open comment
- [x] Apply template button (replaces current questions with template)
- [x] Confirmation dialog before replacing

### 4.3 Question List with Drag & Drop
- [x] Create sortable question list with @dnd-kit
  - [x] DndContext wrapper
  - [x] SortableContext with vertical list strategy
  - [x] Draggable question items with handle
- [x] Implement reorder logic (update order_index in database)
- [x] Visual feedback during drag (placeholder, opacity change)

### 4.4 Question Item Component
- [x] Display question type icon
- [x] Display question label (truncated if long)
- [x] Display required indicator
- [x] Drag handle
- [x] Edit button (opens editor)
- [x] Delete button with confirmation

### 4.5 Question Editor
- [x] Create side panel or modal for editing question
- [x] Fields:
  - [x] Label (required)
  - [x] Description (optional)
  - [x] Type selector (disabled for existing, only for new)
  - [x] Required toggle
  - [x] Options editor (for multiple_choice, single_choice)
- [x] Save and cancel buttons
- [x] Real-time validation

### 4.6 Add Question
- [x] Add question button
- [x] Type selector dropdown/menu
- [x] Create question with default values
- [x] Open editor for new question
- [x] Enforce max 6 questions limit

### 4.7 Reward Text Editor
- [x] Text input for reward message
- [ ] Preview of how it will look (skipped for MVP)
- [x] Auto-save or explicit save button

---

## Phase 5: Customer Feedback Flow

### 5.1 Route Setup
- [x] Create route structure: `/r/[restaurantSlug]/[formId]/[index]/page.tsx`
- [x] Create layout for feedback flow
- [x] Create redirect from `/r/[restaurantSlug]/[formId]` to `/r/[restaurantSlug]/[formId]/1`

### 5.2 Data Fetching
- [x] Fetch restaurant by slug (server component)
- [x] Fetch form and questions (server component)
- [x] Handle 404 for invalid slug/form
- [x] Calculate total questions, current question, navigation URLs

### 5.3 Feedback Layout
- [x] Full-screen centered layout
- [x] Restaurant branding (logo if available, or name)
- [x] Clean, minimal design
- [x] Mobile-optimized

### 5.4 Progress Bar
- [x] Show current question number and total
- [x] Percentage progress bar
- [x] Animated width transitions

### 5.5 Animated Question Wrapper
- [x] Framer Motion AnimatePresence
- [x] Slide animation: `x: 50 → 0 → -50`
- [x] Key based on question index for re-animation

### 5.6 Question Screen
- [x] Large question label as heading
- [x] Helper text (description) if present
- [x] Required indicator
- [x] Field component based on type
- [x] Validation error display

### 5.7 Field Components
- [x] **SentimentField**: Three large buttons (Bad, Ok, Great)
- [x] **StarRatingField**: 5 clickable stars with hover effect
- [x] **OpenTextField**: Large textarea with character count
- [x] **MultipleChoiceField**: Styled checkboxes
- [x] **SingleChoiceField**: Styled radio buttons
- [x] All fields: consistent styling, large touch targets, focus states

### 5.8 Navigation
- [x] Back button (hidden on first question)
- [x] Next button (shows "Completa" on last question)
- [x] Loading states during save
- [ ] Keyboard navigation (Enter to proceed) - skipped for MVP

### 5.9 Answer Persistence
- [x] Create submission on first question (if not exists)
- [x] Save answer to database on "Next"
- [x] Track overall_sentiment from sentiment question
- [x] Update submission with completed_at on final submit

### 5.10 Reward Screen
- [x] Create reward page (`/r/[restaurantSlug]/[formId]/reward`)
- [x] Display reward text from form settings
- [x] Trigger confetti animation on load
- [x] Conditional social buttons:
  - [x] If sentiment === 'great': Show all configured platforms
  - [x] If sentiment !== 'great': Show only reward, maybe "Seguici su Instagram" softly
- [x] Social button components with proper deep links

---

## Phase 6: QR Code Generation

### 6.1 QR Code Page
- [x] Create QR code page (`/dashboard/qr-codes`)
- [x] Generate QR code with `qrcode` library
- [x] Display QR code preview on page
- [x] Show the URL that's encoded

### 6.2 PDF Download
- [x] Create PDF with jspdf
- [x] Include QR code centered
- [x] Include restaurant name
- [x] Include instruction text (e.g., "Scansiona per lasciare un feedback")
- [x] Download button

### 6.3 QR Code Styling (MVP)
- [x] Basic black & white QR code
- [x] Appropriate size for print (minimum 2cm x 2cm recommended)
- [x] Error correction level H (high) for better scannability

---

## Phase 7: Settings

### 7.1 Settings Page
- [x] Create settings page (`/dashboard/settings`)
- [x] Sections: Restaurant Info, Social Links

### 7.2 Restaurant Info Section
- [x] Edit restaurant name
- [x] Edit/view slug (maybe read-only after creation)
- [ ] Upload logo (Supabase Storage) - skipped for MVP
- [x] Save button with loading state

### 7.3 Social Links Section
- [x] Google Business URL input (with helper text on how to find it)
- [x] Instagram handle input (just handle, not full URL)
- [x] TripAdvisor URL input
- [x] Facebook URL input
- [x] Save button
- [ ] Validation (URL format where applicable) - basic validation only

---

## Phase 8: Stripe Integration

### 8.1 Subscription Status
- [x] Check subscription status on dashboard load
- [ ] If trial expired and no active subscription: show upgrade prompt - skipped for MVP
- [x] Display trial days remaining in dashboard

### 8.2 Checkout Flow
- [x] Create billing page (`/dashboard/billing`)
- [x] "Abbonati ora" button → Stripe Checkout
- [x] Create Checkout session with trial if eligible
- [x] Success/cancel redirect URLs

### 8.3 Customer Portal
- [x] "Gestisci abbonamento" button → Stripe Customer Portal
- [x] Create portal session and redirect

### 8.4 Webhook Handler
- [x] Create webhook route (`/api/webhooks/stripe`)
- [x] Verify webhook signature
- [x] Handle `checkout.session.completed`: Update subscription info
- [x] Handle `customer.subscription.updated`: Update status
- [x] Handle `customer.subscription.deleted`: Mark as cancelled
- [x] Handle `invoice.payment_failed`: Mark as past_due

### 8.5 Access Control
- [ ] Middleware to check subscription status - skipped for MVP
- [ ] Allow access during trial - skipped for MVP
- [ ] Block dashboard access if subscription inactive (except billing page) - skipped for MVP
- [ ] Show appropriate messaging for expired/cancelled - skipped for MVP

---

## Phase 9: Polish & Launch Prep

### 9.1 Error Handling
- [ ] Global error boundary
- [ ] API error responses (consistent format)
- [ ] User-friendly error messages in Italian
- [ ] 404 page
- [ ] Loading skeletons for all async content

### 9.2 SEO & Meta
- [ ] Landing page meta tags
- [ ] OpenGraph images
- [ ] Favicon
- [ ] robots.txt
- [ ] sitemap.xml (basic)

### 9.3 Legal Pages
- [ ] Privacy Policy page (`/privacy`)
- [ ] Terms of Service page (`/terms`)
- [ ] Cookie banner (if needed)
- [ ] Links in footer and signup flow

### 9.4 Landing Page
- [ ] Hero section with value proposition
- [ ] How it works (3 steps)
- [ ] Pricing section (single plan)
- [ ] CTA to signup
- [ ] Footer with legal links

### 9.5 Final Testing
- [ ] Test complete signup flow
- [ ] Test form builder (all question types)
- [ ] Test customer feedback flow (all question types)
- [ ] Test QR code generation and scanning
- [ ] Test Stripe checkout and webhooks
- [ ] Test on mobile devices
- [ ] Test edge cases (empty form, max questions, etc.)

### 9.6 Launch
- [ ] Set up production environment variables
- [ ] Configure custom domain
- [ ] Enable Stripe live mode
- [ ] Final deployment
- [ ] Monitor for errors

---

## Notes

- Keep this file updated as you complete tasks
- If you discover new tasks, add them in the appropriate phase
- If a task is blocked, note the blocker
- Prioritize completing phases in order, but small fixes can be done anytime
