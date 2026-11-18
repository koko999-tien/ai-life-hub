import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient<Database>>);

// LocalStorage keys (centralized so 1-click personal data deletion can clean everything reliably)
export const LOCAL_STORAGE_KEYS = {
  BOOKMARKS: 'ai_life_hub_bookmarks',
  COMMUNITY_PROMPTS: 'ai_life_hub_community_prompts',
  NEWSLETTER: 'ai_life_hub_newsletter_subscriptions',
  WORKSPACE_SESSIONS: 'ai_life_hub_workspace_sessions',
  PERSONAL_TEMPLATES: 'ai_life_hub_personal_templates',
  ANALYTICS_EVENTS: 'ai_life_hub_analytics_events',
} as const;

export interface BookmarkItem {
  id: string;
  itemType: 'skill' | 'prompt' | 'resource';
  itemId: string;
  itemTitle: string;
  itemSlug: string;
  categoryId: string;
  createdAt: string;
}

export async function fetchBookmarks(userId?: string): Promise<BookmarkItem[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await (supabase as any)
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as any[]).map((b) => ({
          id: b.id,
          itemType: b.item_type,
          itemId: b.item_id,
          itemTitle: b.item_title,
          itemSlug: b.item_slug,
          categoryId: b.category_id,
          createdAt: b.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchBookmarks fallback to localStorage:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function toggleBookmarkStorage(
  item: Omit<BookmarkItem, 'id' | 'createdAt'>,
  userId?: string
): Promise<{ bookmarked: boolean; item: BookmarkItem }> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const client = supabase as any;
      const { data: existing } = await client
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', item.itemId)
        .maybeSingle();

      if (existing) {
        await client.from('bookmarks').delete().eq('id', existing.id);
        return {
          bookmarked: false,
          item: { ...item, id: existing.id, createdAt: new Date().toISOString() },
        };
      } else {
        const { data: inserted, error } = await client
          .from('bookmarks')
          .insert({
            user_id: userId,
            item_type: item.itemType,
            item_id: item.itemId,
            item_title: item.itemTitle,
            item_slug: item.itemSlug,
            category_id: item.categoryId,
          })
          .select()
          .single();

        if (!error && inserted) {
          return {
            bookmarked: true,
            item: {
              id: inserted.id,
              itemType: inserted.item_type,
              itemId: inserted.item_id,
              itemTitle: inserted.item_title,
              itemSlug: inserted.item_slug,
              categoryId: inserted.category_id,
              createdAt: inserted.created_at,
            },
          };
        }
      }
    } catch (e) {
      console.warn('Supabase toggleBookmarkStorage fallback:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
    const list: BookmarkItem[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((b) => b.itemId === item.itemId);

    if (index >= 0) {
      const removed = list.splice(index, 1)[0];
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return { bookmarked: false, item: removed };
    } else {
      const newItem: BookmarkItem = {
        ...item,
        id: `bm-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newItem);
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return { bookmarked: true, item: newItem };
    }
  }

  return {
    bookmarked: false,
    item: { ...item, id: `bm-${Date.now()}`, createdAt: new Date().toISOString() },
  };
}

// Community Prompts Submissions & Listing
export interface CommunityPromptItem {
  id: string;
  title: string;
  description: string;
  template: string;
  categoryId: string;
  authorName: string;
  tags: string[];
  targetService: string;
  upvotes: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  isLocalOnly?: boolean;
}

export async function submitCommunityPrompt(data: {
  title: string;
  description: string;
  template: string;
  categoryId: string;
  authorName: string;
  tags: string[];
  targetService?: string;
  userId?: string;
}) {
  if (isSupabaseConfigured && supabase) {
    return await (supabase as any).from('community_prompts').insert({
      title: data.title,
      description: data.description,
      template: data.template,
      category_id: data.categoryId,
      author_name: data.authorName || 'Thành viên cộng đồng',
      tags: data.tags,
      target_service: data.targetService || 'chatgpt',
      user_id: data.userId || null,
      status: 'pending',
    });
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMUNITY_PROMPTS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `cp-${Date.now()}`,
      title: data.title,
      description: data.description,
      template: data.template,
      categoryId: data.categoryId,
      authorName: data.authorName || 'Thành viên cộng đồng',
      tags: data.tags,
      targetService: data.targetService || 'chatgpt',
      upvotes: 1,
      status: 'approved',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMMUNITY_PROMPTS, JSON.stringify(list));
    return { error: null };
  }

  return { error: null };
}

export async function fetchCommunityPrompts(): Promise<CommunityPromptItem[]> {
  const results: CommunityPromptItem[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from('community_prompts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data)) {
        for (const item of data) {
          results.push({
            id: item.id,
            title: item.title,
            description: item.description,
            template: item.template,
            categoryId: item.category_id,
            authorName: item.author_name || 'Thành viên cộng đồng',
            tags: Array.isArray(item.tags) ? item.tags : [],
            targetService: item.target_service || 'chatgpt',
            upvotes: item.upvotes || 0,
            status: item.status || 'approved',
            createdAt: item.created_at,
            isLocalOnly: false,
          });
        }
      }
    } catch (e) {
      console.warn('Supabase fetchCommunityPrompts fallback:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMUNITY_PROMPTS);
      if (raw) {
        const localItems = JSON.parse(raw);
        if (Array.isArray(localItems)) {
          for (const item of localItems) {
            results.push({
              id: item.id,
              title: item.title,
              description: item.description,
              template: item.template,
              categoryId: item.categoryId || item.category_id || 'cong-viec',
              authorName: item.authorName || item.author_name || 'Của bạn',
              tags: Array.isArray(item.tags) ? item.tags : [],
              targetService: item.targetService || item.target_service || 'chatgpt',
              upvotes: item.upvotes || 1,
              status: item.status || 'approved',
              createdAt: item.created_at || item.createdAt || new Date().toISOString(),
              isLocalOnly: true,
            });
          }
        }
      }
    } catch {
      // Ignore malformed localStorage
    }
  }

  return results;
}

export function deleteLocalCommunityPrompt(promptId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMUNITY_PROMPTS);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return;
    const next = list.filter((p: any) => p.id !== promptId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMMUNITY_PROMPTS, JSON.stringify(next));
  } catch {
    // Ignore
  }
}

// Skill Reviews System (strictly real user/Supabase reviews — zero fabricated reviews)
export interface SkillReviewItem {
  id: string;
  userName: string;
  skillSlug: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function fetchSkillReviews(skillSlug: string): Promise<SkillReviewItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from('skill_reviews')
        .select('*')
        .eq('skill_slug', skillSlug)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          userName: r.user_name,
          skillSlug: r.skill_slug,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchSkillReviews fallback:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(`reviews_${skillSlug}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function submitSkillReview(data: {
  userName: string;
  skillSlug: string;
  rating: number;
  comment: string;
  userId?: string;
}) {
  if (isSupabaseConfigured && supabase) {
    return await (supabase as any).from('skill_reviews').insert({
      user_name: data.userName,
      skill_slug: data.skillSlug,
      rating: data.rating,
      comment: data.comment,
      user_id: data.userId || null,
    });
  }

  if (typeof window !== 'undefined') {
    const key = `reviews_${data.skillSlug}`;
    const raw = localStorage.getItem(key);
    const list: SkillReviewItem[] = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `rev-${Date.now()}`,
      userName: data.userName,
      skillSlug: data.skillSlug,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(list));
    return { error: null };
  }

  return { error: null };
}

// Newsletter Subscription Persistence
export async function subscribeNewsletter(email: string): Promise<{ mode: 'supabase' | 'local'; alreadySubscribed?: boolean }> {
  const normalized = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await (supabase as any)
        .from('newsletter_subscribers')
        .insert({ email: normalized });
      if (!error) {
        return { mode: 'supabase' };
      }
      if (error.code === '23505') {
        return { mode: 'supabase', alreadySubscribed: true };
      }
    } catch (e) {
      console.warn('Supabase subscribeNewsletter fallback:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.NEWSLETTER);
    const list: Array<{ email: string; createdAt: string }> = raw ? JSON.parse(raw) : [];
    const exists = list.some((entry) => entry.email === normalized);
    if (!exists) {
      list.unshift({ email: normalized, createdAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_STORAGE_KEYS.NEWSLETTER, JSON.stringify(list));
    }
    return { mode: 'local', alreadySubscribed: exists };
  }

  return { mode: 'local' };
}

/**
 * Deletes all local personal data stored by AI Life Hub in this browser
 * (bookmarks, workspace sessions, personal templates, local prompts, reviews, newsletter, analytics).
 */
export function clearAllLocalPersonalData(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('reviews_') || k.startsWith('ai_life_hub_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new Event('bookmarks-updated'));
    window.dispatchEvent(new Event('workspace-sessions-updated'));
  } catch (e) {
    console.error('Failed to clear local personal data:', e);
  }
}
