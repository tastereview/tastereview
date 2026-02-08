-- BiteReview Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ============================================
-- TABLES
-- ============================================

-- Restaurant owners
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users NOT NULL,
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
  trial_ends_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- Feedback forms (one per restaurant for MVP, but structured for multiple)
CREATE TABLE forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  reward_text text,
  created_at timestamptz DEFAULT now()
);

-- Form questions
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('sentiment', 'star_rating', 'open_text', 'multiple_choice', 'single_choice')),
  label text NOT NULL,
  description text,
  is_required boolean DEFAULT true,
  options jsonb,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Feedback submissions
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms ON DELETE CASCADE NOT NULL,
  table_identifier text,
  overall_sentiment text CHECK (overall_sentiment IN ('bad', 'ok', 'great')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Individual answers
CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES questions ON DELETE CASCADE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_forms_restaurant_id ON forms(restaurant_id);
CREATE INDEX idx_questions_form_id ON questions(form_id);
CREATE INDEX idx_questions_order ON questions(form_id, order_index);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_answers_submission_id ON answers(submission_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Restaurants: Owner can only access their own restaurant
CREATE POLICY "Users can view own restaurant"
  ON restaurants FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own restaurant"
  ON restaurants FOR UPDATE
  USING (auth.uid() = owner_id);

-- Forms: Owner can access forms for their restaurant
CREATE POLICY "Users can view own forms"
  ON forms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = forms.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own forms"
  ON forms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = forms.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own forms"
  ON forms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = forms.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own forms"
  ON forms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = forms.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Public can view active forms (for feedback flow)
CREATE POLICY "Public can view active forms"
  ON forms FOR SELECT
  USING (is_active = true);

-- Questions: Owner can access questions for their forms
CREATE POLICY "Users can view own questions"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE forms.id = questions.form_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own questions"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE forms.id = questions.form_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own questions"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM forms
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE forms.id = questions.form_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own questions"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM forms
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE forms.id = questions.form_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Public can view questions (for feedback flow)
CREATE POLICY "Public can view questions for active forms"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = questions.form_id
      AND forms.is_active = true
    )
  );

-- Submissions: Owner can read, public can insert
CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE forms.id = submissions.form_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update own submissions"
  ON submissions FOR UPDATE
  USING (true);

-- Answers: Owner can read, public can insert
CREATE POLICY "Users can view own answers"
  ON answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      JOIN forms ON forms.id = submissions.form_id
      JOIN restaurants ON restaurants.id = forms.restaurant_id
      WHERE submissions.id = answers.submission_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert answers"
  ON answers FOR INSERT
  WITH CHECK (true);
