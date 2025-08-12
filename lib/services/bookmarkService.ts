// lib/services/bookmarkService.ts
import type { Bookmark } from '../types';

// In-memory storage for bookmarks (will be replaced with Firebase later)
let bookmarksStore: Map<string, Set<string>> = new Map(); // userId -> Set of ideaIds

export class BookmarkService {
  /**
   * Toggle bookmark for a user
   */
  static async toggleBookmark(userId: string, ideaId: string): Promise<boolean> {
    if (!userId || !ideaId) {
      throw new Error('User ID and Idea ID are required');
    }

    // Get or create user's bookmark set
    let userBookmarks = bookmarksStore.get(userId);
    if (!userBookmarks) {
      userBookmarks = new Set();
      bookmarksStore.set(userId, userBookmarks);
    }

    // Toggle bookmark
    if (userBookmarks.has(ideaId)) {
      userBookmarks.delete(ideaId);
      return false; // Removed
    } else {
      userBookmarks.add(ideaId);
      return true; // Added
    }
  }

  /**
   * Get all bookmarks for a user
   */
  static async getUserBookmarks(userId: string): Promise<string[]> {
    if (!userId) return [];
    
    const userBookmarks = bookmarksStore.get(userId);
    return userBookmarks ? Array.from(userBookmarks) : [];
  }

  /**
   * Check if an idea is bookmarked by a user
   */
  static async isBookmarked(userId: string, ideaId: string): Promise<boolean> {
    if (!userId || !ideaId) return false;
    
    const userBookmarks = bookmarksStore.get(userId);
    return userBookmarks ? userBookmarks.has(ideaId) : false;
  }

  /**
   * Get bookmark count for an idea
   */
  static async getBookmarkCount(ideaId: string): Promise<number> {
    let count = 0;
    bookmarksStore.forEach((bookmarks) => {
      if (bookmarks.has(ideaId)) count++;
    });
    return count;
  }

  /**
   * Remove all bookmarks for a user
   */
  static async clearUserBookmarks(userId: string): Promise<void> {
    bookmarksStore.delete(userId);
  }

  /**
   * Get bookmarks with timestamps (for dashboard)
   */
  static async getUserBookmarksWithDetails(userId: string): Promise<Bookmark[]> {
    const ideaIds = await this.getUserBookmarks(userId);
    return ideaIds.map(ideaId => ({
      ideaId,
      userUid: userId,
      createdAt: new Date().toISOString() // In production, store actual timestamps
    }));
  }
}