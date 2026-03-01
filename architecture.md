# TasteReview - Architecture Reference

Reference material for detailed implementation work. Don't read top-to-bottom — search for the section you need.

---

## Route Map

| Route | Type | Description |
|-|-|-|
| `/` | Public | Landing page |
| `/login` | Public | Owner login |
| `/signup` | Public | Owner registration |
| `/onboarding` | Protected | Post-signup restaurant setup |
| `/dashboard` | Protected | Main dashboard |
| `/dashboard/feedback` | Protected | Feedback submissions list |
| `/dashboard/form-builder` | Protected | Create/edit feedback form |
| `/dashboard/qr-codes` | Protected | QR generation + PDF download |
| `/dashboard/settings` | Protected | Restaurant settings, social links |
| `/dashboard/billing` | Protected | Stripe Customer Portal redirect |
| `/r/[slug]/[formId]` | Public | Redirects to /1 |
| `/r/[slug]/[formId]/[index]` | Public | Question at index N |
| `/r/[slug]/[formId]/reward` | Public | Reward screen + social buttons |

---

## Component Trees

### Customer Feedback Flow
```
/r/[slug]/[formId]/[index]/page.tsx (Server Component)
  └── FeedbackLayout.tsx
        └── QuestionPageClient.tsx (Client Component)
              ├── ProgressBar.tsx
              ├── AnimatedQuestion.tsx (Framer Motion wrapper)
              │     └── QuestionScreen.tsx
              │           └── FieldRenderer.tsx
              │                 ├── SentimentField.tsx
              │                 ├── StarRatingField.tsx
              │                 ├── OpenTextField.tsx
              │                 ├── MultipleChoiceField.tsx
              │                 └── SingleChoiceField.tsx
              └── NavigationButtons.tsx
```

### Form Builder
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

## Database Tables

| Table | Purpose | Key fields |
|-|-|-|
| `restaurants` | Owner accounts | `owner_id`, `slug`, `stripe_*`, `subscription_status` |
| `forms` | Feedback forms | `restaurant_id`, `is_active`, `reward_text` |
| `questions` | Form questions | `form_id`, `type`, `label`, `options` (jsonb), `order_index` |
| `submissions` | Feedback sessions | `form_id`, `overall_sentiment`, `completed_at` |
| `answers` | Individual answers | `submission_id`, `question_id`, `value` (jsonb) |

---

## Stripe Webhook Events

| Event | Action |
|-|-|
| `checkout.session.completed` | Activate subscription |
| `customer.subscription.updated` | Update status |
| `customer.subscription.deleted` | Handle cancellation |
| `invoice.payment_failed` | Handle failed payment |

---

## Social Platform Deep Links

| Platform | URL Pattern |
|-|-|
| Google Reviews | `https://search.google.com/local/writereview?placeid=[PLACE_ID]` |
| Instagram | `https://instagram.com/[HANDLE]` |
| TripAdvisor | Direct restaurant page URL |
| Facebook | Direct restaurant page URL |

---

## Default Form Templates

**Quick & Simple (2 questions):** Overall sentiment → Open comment
**Detailed Feedback (4 questions):** Overall sentiment → Food rating → Service rating → Open comment