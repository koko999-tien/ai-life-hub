'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchBookmarks, toggleBookmarkStorage, type BookmarkItem } from '@/lib/supabase/client';

export function useBookmarks(userId?: string) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchBookmarks(userId);
      setBookmarks(items);
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const isBookmarked = useCallback(
    (itemId: string) => {
      return bookmarks.some((b) => b.itemId === itemId);
    },
    [bookmarks]
  );

  const toggle = useCallback(
    async (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
      const { bookmarked, item: resItem } = await toggleBookmarkStorage(item, userId);
      setBookmarks((prev) => {
        if (bookmarked) {
          return [resItem, ...prev];
        } else {
          return prev.filter((b) => b.itemId !== item.itemId);
        }
      });
      return bookmarked;
    },
    [userId]
  );

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    toggle,
    reload: loadBookmarks,
  };
}
