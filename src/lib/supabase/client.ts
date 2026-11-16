import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient<Database>>);

// LocalStorage fallback for Bookmarks
const LOCAL_BOOKMARKS_KEY = 'ai_life_hub_bookmarks';

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

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
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
  // If Supabase is connected and user is logged in
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

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    const list: BookmarkItem[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((b) => b.itemId === item.itemId);

    if (index >= 0) {
      const removed = list.splice(index, 1)[0];
      localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(list));
      return { bookmarked: false, item: removed };
    } else {
      const newItem: BookmarkItem = {
        ...item,
        id: `bm-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newItem);
      localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(list));
      return { bookmarked: true, item: newItem };
    }
  }

  return {
    bookmarked: false,
    item: { ...item, id: `bm-${Date.now()}`, createdAt: new Date().toISOString() },
  };
}

// Community Prompts Submissions
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
      author_name: data.authorName || 'Vô danh',
      tags: data.tags,
      target_service: data.targetService || 'chatgpt',
      user_id: data.userId || null,
      status: 'approved',
    });
  }

  // LocalStorage mock fallback
  if (typeof window !== 'undefined') {
    const LOCAL_PROMPTS_KEY = 'ai_life_hub_community_prompts';
    const raw = localStorage.getItem(LOCAL_PROMPTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `cp-${Date.now()}`,
      ...data,
      upvotes: 1,
      status: 'approved',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_PROMPTS_KEY, JSON.stringify(list));
    return { error: null };
  }

  return { error: null };
}

// Skill Reviews System
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

  // LocalStorage fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(`reviews_${skillSlug}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    // Default initial sample reviews for realistic feel
    return [
      {
        id: 'rev-default-1',
        userName: 'Minh Tuấn (AI Engineer)',
        skillSlug,
        rating: 5,
        comment: 'Kỹ thuật này cực kỳ hữu ích! Sau khi áp dụng vào quy trình hàng ngày, độ chính xác của phản hồi tăng rõ rệt.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'rev-default-2',
        userName: 'Hương Giang',
        skillSlug,
        rating: 5,
        comment: 'Prompt mẫu viết rất chuẩn chỉ, dễ customize theo nhu cầu công việc.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];
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

  // LocalStorage fallback
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
