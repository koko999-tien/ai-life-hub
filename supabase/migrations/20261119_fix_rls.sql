-- ==============================================================================
-- AI LIFE HUB - MIGRATION 20261119: RLS FIXES, updated_at TRIGGER,
-- handle_new_user HARDENING & MISSING INDEXES
-- Do NOT execute automatically against production without explicit authorization.
-- Khắc phục các lỗ hổng còn lại sau 20261116 / 20261118:
--   - community_prompts UPDATE thiếu WITH CHECK (đổi được user_id sang user khác)
--   - workspace_messages INSERT không kiểm tra session thuộc về user
--   - workspace_sessions.updated_at không tự refresh khi UPDATE
--   - handle_new_user() fail khi username trùng / NULL
--   - thiếu index cho bookmarks, community_prompts, skill_reviews
-- ==============================================================================

-- 1. community_prompts UPDATE: thêm WITH CHECK (auth.uid() = user_id)
--    Policy hiện tại (20261116) chỉ có USING, không có WITH CHECK nên một
--    user có thể UPDATE đổi user_id của prompt sang user khác.
DROP POLICY IF EXISTS "Users can update their own prompts" ON public.community_prompts;
CREATE POLICY "Users can update their own prompts"
  ON public.community_prompts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. workspace_messages INSERT: session phải thuộc về chính user đang insert
--    (cột session_id -> public.workspace_sessions.id, user_id -> auth.users).
--    Policy hiện tại (20261118) chỉ kiểm tra auth.uid() = user_id, cho phép
--    chèn message vào session của người khác.
DROP POLICY IF EXISTS "Users can insert own workspace messages" ON public.workspace_messages;
CREATE POLICY "Users can insert own workspace messages"
  ON public.workspace_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.workspace_sessions s
      WHERE s.id = workspace_messages.session_id
        AND s.user_id = auth.uid()
    )
  );

-- 3. Trigger BEFORE UPDATE trên workspace_sessions: refresh updated_at = NOW()
--    (function set_updated_at chưa tồn tại trước migration này).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_workspace_sessions_updated_at ON public.workspace_sessions;
CREATE TRIGGER set_workspace_sessions_updated_at
  BEFORE UPDATE ON public.workspace_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. handle_new_user(): không fail khi username trùng hoặc NULL
--    - INSERT ... ON CONFLICT (id) DO NOTHING: trigger chạy lại / profile
--      đã tồn tại thì bỏ qua thay vì lỗi unique violation.
--    - username: NULL (hoặc chuỗi rỗng) -> để NULL; username đã có người
--      khác dùng -> để NULL thay vì fail vì UNIQUE trên profiles.username.
--    Trigger on_auth_user_created (tạo ở 20261116) vẫn trỏ tới function này
--    nên chỉ cần CREATE OR REPLACE, không cần tạo lại trigger.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  desired_username text := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'user_name', '')), '');
BEGIN
  IF desired_username IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.username = desired_username
  ) THEN
    desired_username := NULL;
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    desired_username
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Index còn thiếu (tên bảng/cột đối chiếu 20261116)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created
  ON public.bookmarks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_prompts_status_created
  ON public.community_prompts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_prompts_category
  ON public.community_prompts (category_id);

CREATE INDEX IF NOT EXISTS idx_skill_reviews_skill_created
  ON public.skill_reviews (skill_slug, created_at DESC);

-- 6. Cột usage_json cho workspace_sessions (phục vụ Dashboard / Usage tracking)
--    Trước đây usage chỉ lưu ở localStorage; session cloud không có usage nên
--    Dashboard/Usage không cộng dồn được. Thêm cột JSONB nullable, code
--    src/lib/workspace/storage.ts đã map usage_json <-> UsageMetrics.
ALTER TABLE public.workspace_sessions
  ADD COLUMN IF NOT EXISTS usage_json JSONB;
