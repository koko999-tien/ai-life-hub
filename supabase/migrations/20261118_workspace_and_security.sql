-- ==============================================================================
-- AI LIFE HUB - MIGRATION 20261118: AI WORKSPACE, PERSONAL DATA & RLS HARDENING
-- Do NOT execute automatically against production without explicit authorization.
-- ==============================================================================

-- 1. Harden RLS Policies on Existing Tables (Prevent User-ID Spoofing & Require Moderation)
ALTER TABLE public.community_prompts ALTER COLUMN status SET DEFAULT 'pending';

DROP POLICY IF EXISTS "Authenticated users can submit prompts" ON public.community_prompts;
CREATE POLICY "Users can submit prompts without spoofing user_id"
  ON public.community_prompts FOR INSERT
  WITH CHECK (
    (user_id IS NULL OR auth.uid() = user_id)
    AND char_length(title) BETWEEN 3 AND 200
    AND char_length(template) BETWEEN 10 AND 20000
  );

DROP POLICY IF EXISTS "Users can view their own pending prompts" ON public.community_prompts;
CREATE POLICY "Users can view their own pending prompts"
  ON public.community_prompts FOR SELECT
  USING (status = 'approved' OR (auth.uid() IS NOT NULL AND auth.uid() = user_id));

DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.community_prompts;
CREATE POLICY "Users can delete their own prompts"
  ON public.community_prompts FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated or guests can post reviews" ON public.skill_reviews;
CREATE POLICY "Users can post bounded reviews without spoofing user_id"
  ON public.skill_reviews FOR INSERT
  WITH CHECK (
    (user_id IS NULL OR auth.uid() = user_id)
    AND rating BETWEEN 1 AND 5
    AND char_length(comment) BETWEEN 3 AND 4000
  );

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.skill_reviews;
CREATE POLICY "Users can delete their own reviews"
  ON public.skill_reviews FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2. AI Workspace Sessions (Strictly Private per Authenticated User)
CREATE TABLE IF NOT EXISTS public.workspace_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 240),
  workflow_id TEXT NOT NULL CHECK (workflow_id IN ('email-assistant', 'meeting-summary', 'document-analysis', 'custom-prompt')),
  model_id TEXT NOT NULL,
  inputs_json JSONB DEFAULT '{}'::jsonb NOT NULL,
  result_text TEXT DEFAULT '' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspace_sessions_user_updated
  ON public.workspace_sessions (user_id, updated_at DESC);

ALTER TABLE public.workspace_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own workspace sessions"
  ON public.workspace_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspace sessions"
  ON public.workspace_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspace sessions"
  ON public.workspace_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspace sessions"
  ON public.workspace_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 3. AI Workspace Messages / Revisions History
CREATE TABLE IF NOT EXISTS public.workspace_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.workspace_sessions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspace_messages_session_created
  ON public.workspace_messages (session_id, created_at ASC);

ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own workspace messages"
  ON public.workspace_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspace messages"
  ON public.workspace_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspace messages"
  ON public.workspace_messages FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Personal Prompt Templates (Private per User)
CREATE TABLE IF NOT EXISTS public.personal_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  description TEXT DEFAULT '' NOT NULL,
  template TEXT NOT NULL CHECK (char_length(template) BETWEEN 5 AND 20000),
  category_id TEXT DEFAULT 'work' NOT NULL,
  workflow_id TEXT DEFAULT 'custom-prompt' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_personal_templates_user_created
  ON public.personal_templates (user_id, created_at DESC);

ALTER TABLE public.personal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own personal templates"
  ON public.personal_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal templates"
  ON public.personal_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal templates"
  ON public.personal_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own personal templates"
  ON public.personal_templates FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Newsletter Subscribers (Insert-only for public; read restricted to service role)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (position('@' in email) > 1 AND char_length(email) <= 254),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe an email"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (position('@' in email) > 1 AND char_length(email) <= 254);
