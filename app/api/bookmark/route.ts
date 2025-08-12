// app/api/bookmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIdea } from '@/lib/db';
import { BookmarkService } from '@/lib/services/bookmarkService';
import type { Bookmark } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { ideaId, userUid } = await req.json();
    
    if (!ideaId || !userUid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if idea exists
    const idea = await getIdea(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    // Toggle bookmark using service
    const isBookmarked = await BookmarkService.toggleBookmark(userUid, ideaId);
    const bookmarkCount = await BookmarkService.getBookmarkCount(ideaId);
    
    return NextResponse.json({
      success: true,
      bookmarked: isBookmarked,
      bookmarkCount,
      message: isBookmarked ? 'Bookmark added' : 'Bookmark removed'
    });
    
  } catch (error) {
    console.error('Bookmark error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userUid = searchParams.get('userUid');
  const ideaId = searchParams.get('ideaId');
  
  if (!userUid) {
    return NextResponse.json({ error: 'userUid is required' }, { status: 400 });
  }
  
  if (ideaId) {
    // Check if specific idea is bookmarked by user
    const isBookmarked = await BookmarkService.isBookmarked(userUid, ideaId);
    const bookmarkCount = await BookmarkService.getBookmarkCount(ideaId);
    return NextResponse.json({ bookmarked: isBookmarked, bookmarkCount });
  } else {
    // Return all bookmarks for user
    const userBookmarks = await BookmarkService.getUserBookmarksWithDetails(userUid);
    
    return NextResponse.json({ 
      bookmarks: userBookmarks,
      count: userBookmarks.length 
    });
  }
}