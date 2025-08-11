// app/api/bookmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIdea } from '@/lib/db';
import type { Bookmark } from '@/lib/types';

// Simple in-memory storage for bookmarks (replace with database in production)
const bookmarks: Bookmark[] = [];

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
    
    // Check if bookmark already exists
    const existingBookmarkIndex = bookmarks.findIndex(b => b.ideaId === ideaId && b.userUid === userUid);
    
    if (existingBookmarkIndex >= 0) {
      // Remove bookmark (toggle off)
      bookmarks.splice(existingBookmarkIndex, 1);
      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed'
      });
    } else {
      // Add bookmark
      const newBookmark: Bookmark = {
        ideaId,
        userUid,
        createdAt: new Date().toISOString()
      };
      bookmarks.push(newBookmark);
      
      return NextResponse.json({
        success: true,
        bookmarked: true,
        message: 'Bookmark added'
      });
    }
    
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
    const isBookmarked = bookmarks.some(b => b.ideaId === ideaId && b.userUid === userUid);
    return NextResponse.json({ bookmarked: isBookmarked });
  } else {
    // Return all bookmarks for user
    const userBookmarks = bookmarks
      .filter(b => b.userUid === userUid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ bookmarks: userBookmarks });
  }
}