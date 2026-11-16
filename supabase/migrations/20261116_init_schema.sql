-- ==============================================================================
-- AI LIFE HUB - SUPABASE INITIAL SCHEMA
-- Comprehensive database for Community Prompts, Bookmarks, Reviews & Profiles
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('skill', 'prompt', 'resource')),
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_slug TEXT NOT NULL,
  category_id TEXT DEFAULT 'learning',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Community Prompts Table
CREATE TABLE IF NOT EXISTS public.community_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Ẩn danh',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  template TEXT NOT NULL,
  category_id TEXT DEFAULT 'prompt-engineering',
  tags TEXT[] DEFAULT '{}',
  target_service TEXT DEFAULT 'chatgpt' CHECK (target_service IN ('chatgpt', 'claude', 'gemini', 'all')),
  upvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.community_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved community prompts are viewable by everyone"
  ON public.community_prompts FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Authenticated users can submit prompts"
  ON public.community_prompts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own prompts"
  ON public.community_prompts FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Skill Reviews Table
CREATE TABLE IF NOT EXISTS public.skill_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  skill_slug TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.skill_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.skill_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated or guests can post reviews"
  ON public.skill_reviews FOR INSERT
  WITH CHECK (true);

-- 5. Trigger for New User Profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
