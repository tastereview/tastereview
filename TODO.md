# BiteReview - Implementation Plan

> **IMPORTANT:** Read this file at the start of every new chat session. Follow tasks in order. Mark tasks as complete with `[x]` when done.

---

## Phase 1: Project Setup

### 1.1 Initialize Project
- [x] Create Next.js 14 project with App Router (`npx create-next-app@latest bitereview --typescript --tailwind --eslint --app`)
- [x] Initialize Git repository
- [ ] Create GitHub repository and push initial commit
- [ ] Connect to Vercel for automatic deployments

### 1.2 Install Dependencies
- [ ] Install shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Install core shadcn components: button, input, card, dialog, dropdown-menu, form, label, progress, toast, tabs
- [ ] Install Framer Motion (`npm install framer-motion`)
- [ ] Install @dnd-kit (`npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`)
- [ ] Install qrcode and jspdf (`npm install qrcode jspdf @types/qrcode`)
- [ ] Install nanoid (`npm install nanoid`)
- [ ] Install Stripe (`npm install stripe @stripe/stripe-js`)
- [ ] Install Supabase (`npm install @supabase/supabase-js @supabase/ssr`)
- [ ] Install canvas-confetti (`npm install canvas-confetti @types/canvas-confetti`)
- [ ] Install lucide-react for icons (`npm install lucide-react`)

### 1.3 Configure Supabase
- [ ] Create Supabase project
- [ ] Set up environment variables in `.env.local`
- [ ] Create Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- [ ] Create database tables (run SQL from CLAUDE.md schema)
- [ ] Set up Row Level Security policies
- [ ] Enable email/password authentication in Supabase dashboard

### 1.4 Configure Stripe
- [ ] Create Stripe account (or use test mode)
- [ ] Create product and price (€39/month with 7-day trial)
- [ ] Set up environment variables
- [ ] Create Stripe webhook endpoint in Vercel
- [ ] Configure webhook in Stripe dashboard

### 1.5 Project Structure
- [ ] Create folder structure:
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
- [ ] Create TypeScript types (`types/database.types.ts`, `types/forms.types.ts`)
- [ ] Apply tweakcn theme customization

---

## Phase 2: Authentication & Onboarding

### 2.1 Authentication Pages
- [ ] Create login page (`/login`)
  - [ ] Email/password form
  - [ ] Error handling and validation
  - [ ] Redirect to dashboard on success
  - [ ] Link to signup
- [ ] Create signup page (`/signup`)
  - [ ] Email/password form with confirmation
  - [ ] Error handling and validation
  - [ ] Auto-login after signup
  - [ ] Redirect to onboarding
- [ ] Create auth middleware (protect dashboard routes)

### 2.2 Restaurant Onboarding
- [ ] Create onboarding page (`/onboarding`)
  - [ ] Step 1: Restaurant name
  - [ ] Step 2: Create URL slug (auto-generate from name, allow edit)
  - [ ] Auto-create restaurant record in database
  - [ ] Auto-create default form with "Quick & Simple" template
  - [ ] Redirect to dashboard

### 2.3 Auth Utilities
- [ ] Create `useAuth` hook (get current user, loading state)
- [ ] Create `useRestaurant` hook (get current restaurant for logged-in user)
- [ ] Create sign-out functionality

---

## Phase 3: Dashboard Foundation

### 3.1 Dashboard Layout
- [ ] Create dashboard layout with sidebar navigation
  - [ ] Logo/brand at top
  - [ ] Navigation items: Feedback, Modulo, QR Code, Impostazioni, Abbonamento
  - [ ] User menu with sign out
- [ ] Create responsive mobile navigation (hamburger menu)

### 3.2 Dashboard Home / Feedback List
- [ ] Create feedback list page (`/dashboard` or `/dashboard/feedback`)
  - [ ] Fetch submissions for restaurant
  - [ ] Display in table/list format: date, overall sentiment (icon), preview of first answer
  - [ ] Click to expand/view full submission
  - [ ] Empty state when no submissions
- [ ] Create simple stats section
  - [ ] Total submissions count
  - [ ] Sentiment breakdown (Great/Ok/Bad counts or percentages)

### 3.3 Submission Detail View
- [ ] Create submission detail modal or slide-over
  - [ ] Show all questions and answers
  - [ ] Show timestamp
  - [ ] Show table identifier (if present, for future feature)

---

## Phase 4: Form Builder

### 4.1 Form Builder Page
- [ ] Create form builder page (`/dashboard/form-builder`)
- [ ] Fetch current form and questions for restaurant
- [ ] Display current form structure

### 4.2 Template Selector
- [ ] Create template selector component
  - [ ] "Quick & Simple" template: Overall sentiment + open comment
  - [ ] "Feedback Dettagliato" template: Overall sentiment + food rating + service rating + open comment
- [ ] Apply template button (replaces current questions with template)
- [ ] Confirmation dialog before replacing

### 4.3 Question List with Drag & Drop
- [ ] Create sortable question list with @dnd-kit
  - [ ] DndContext wrapper
  - [ ] SortableContext with vertical list strategy
  - [ ] Draggable question items with handle
- [ ] Implement reorder logic (update order_index in database)
- [ ] Visual feedback during drag (placeholder, opacity change)

### 4.4 Question Item Component
- [ ] Display question type icon
- [ ] Display question label (truncated if long)
- [ ] Display required indicator
- [ ] Drag handle
- [ ] Edit button (opens editor)
- [ ] Delete button with confirmation

### 4.5 Question Editor
- [ ] Create side panel or modal for editing question
- [ ] Fields:
  - [ ] Label (required)
  - [ ] Description (optional)
  - [ ] Type selector (disabled for existing, only for new)
  - [ ] Required toggle
  - [ ] Options editor (for multiple_choice, single_choice)
- [ ] Save and cancel buttons
- [ ] Real-time validation

### 4.6 Add Question
- [ ] Add question button
- [ ] Type selector dropdown/menu
- [ ] Create question with default values
- [ ] Open editor for new question
- [ ] Enforce max 6 questions limit

### 4.7 Reward Text Editor
- [ ] Text input for reward message
- [ ] Preview of how it will look
- [ ] Auto-save or explicit save button

---

## Phase 5: Customer Feedback Flow

### 5.1 Route Setup
- [ ] Create route structure: `/r/[restaurantSlug]/[formId]/[index]/page.tsx`
- [ ] Create layout for feedback flow
- [ ] Create redirect from `/r/[restaurantSlug]/[formId]` to `/r/[restaurantSlug]/[formId]/1`

### 5.2 Data Fetching
- [ ] Fetch restaurant by slug (server component)
- [ ] Fetch form and questions (server component)
- [ ] Handle 404 for invalid slug/form
- [ ] Calculate total questions, current question, navigation URLs

### 5.3 Feedback Layout
- [ ] Full-screen centered layout
- [ ] Restaurant branding (logo if available, or name)
- [ ] Clean, minimal design
- [ ] Mobile-optimized

### 5.4 Progress Bar
- [ ] Show current question number and total
- [ ] Percentage progress bar
- [ ] Animated width transitions

### 5.5 Animated Question Wrapper
- [ ] Framer Motion AnimatePresence
- [ ] Slide animation: `x: 50 → 0 → -50`
- [ ] Key based on question index for re-animation

### 5.6 Question Screen
- [ ] Large question label as heading
- [ ] Helper text (description) if present
- [ ] Required indicator
- [ ] Field component based on type
- [ ] Validation error display

### 5.7 Field Components
- [ ] **SentimentField**: Three large buttons (Bad 😞, Ok 😐, Great 😊)
- [ ] **StarRatingField**: 5 clickable stars with hover effect
- [ ] **OpenTextField**: Large textarea with character count
- [ ] **MultipleChoiceField**: Styled checkboxes
- [ ] **SingleChoiceField**: Styled radio buttons
- [ ] All fields: consistent styling, large touch targets, focus states

### 5.8 Navigation
- [ ] Back button (hidden on first question)
- [ ] Next button (shows "Completa" on last question)
- [ ] Loading states during save
- [ ] Keyboard navigation (Enter to proceed)

### 5.9 Answer Persistence
- [ ] Create submission on first question (if not exists)
- [ ] Save answer to database on "Next"
- [ ] Track overall_sentiment from sentiment question
- [ ] Update submission with completed_at on final submit

### 5.10 Reward Screen
- [ ] Create reward page (`/r/[restaurantSlug]/[formId]/reward`)
- [ ] Display reward text from form settings
- [ ] Trigger confetti animation on load
- [ ] Conditional social buttons:
  - [ ] If sentiment === 'great': Show all configured platforms
  - [ ] If sentiment !== 'great': Show only reward, maybe "Seguici su Instagram" softly
- [ ] Social button components with proper deep links

---

## Phase 6: QR Code Generation

### 6.1 QR Code Page
- [ ] Create QR code page (`/dashboard/qr-codes`)
- [ ] Generate QR code with `qrcode` library
- [ ] Display QR code preview on page
- [ ] Show the URL that's encoded

### 6.2 PDF Download
- [ ] Create PDF with jspdf
- [ ] Include QR code centered
- [ ] Include restaurant name
- [ ] Include instruction text (e.g., "Scansiona per lasciare un feedback")
- [ ] Download button

### 6.3 QR Code Styling (MVP)
- [ ] Basic black & white QR code
- [ ] Appropriate size for print (minimum 2cm x 2cm recommended)
- [ ] Error correction level H (high) for better scannability

---

## Phase 7: Settings

### 7.1 Settings Page
- [ ] Create settings page (`/dashboard/settings`)
- [ ] Sections: Restaurant Info, Social Links

### 7.2 Restaurant Info Section
- [ ] Edit restaurant name
- [ ] Edit/view slug (maybe read-only after creation)
- [ ] Upload logo (Supabase Storage)
- [ ] Save button with loading state

### 7.3 Social Links Section
- [ ] Google Business URL input (with helper text on how to find it)
- [ ] Instagram handle input (just handle, not full URL)
- [ ] TripAdvisor URL input
- [ ] Facebook URL input
- [ ] Save button
- [ ] Validation (URL format where applicable)

---

## Phase 8: Stripe Integration

### 8.1 Subscription Status
- [ ] Check subscription status on dashboard load
- [ ] If trial expired and no active subscription: show upgrade prompt
- [ ] Display trial days remaining in dashboard

### 8.2 Checkout Flow
- [ ] Create billing page (`/dashboard/billing`)
- [ ] "Abbonati ora" button → Stripe Checkout
- [ ] Create Checkout session with trial if eligible
- [ ] Success/cancel redirect URLs

### 8.3 Customer Portal
- [ ] "Gestisci abbonamento" button → Stripe Customer Portal
- [ ] Create portal session and redirect

### 8.4 Webhook Handler
- [ ] Create webhook route (`/api/webhooks/stripe`)
- [ ] Verify webhook signature
- [ ] Handle `checkout.session.completed`: Update subscription info
- [ ] Handle `customer.subscription.updated`: Update status
- [ ] Handle `customer.subscription.deleted`: Mark as cancelled
- [ ] Handle `invoice.payment_failed`: Mark as past_due

### 8.5 Access Control
- [ ] Middleware to check subscription status
- [ ] Allow access during trial
- [ ] Block dashboard access if subscription inactive (except billing page)
- [ ] Show appropriate messaging for expired/cancelled

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
