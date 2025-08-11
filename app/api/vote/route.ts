// app/api/vote/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIdea, upsertIdeas } from '@/lib/db';
import type { Vote, Idea } from '@/lib/types';

// Simple in-memory storage for votes (replace with database in production)
const votes: Vote[] = [];

export async function POST(req: NextRequest) {
  try {
    const { ideaId, vote, userUid, userEmail } = await req.json();
    
    if (!ideaId || !vote || !userUid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (!['up', 'down'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }
    
    // Check if idea exists
    const idea = await getIdea(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    // Remove any existing vote from this user for this idea
    const existingVoteIndex = votes.findIndex(v => v.ideaId === ideaId && v.voterUid === userUid);
    let wasUpVote = false;
    let wasDownVote = false;
    
    if (existingVoteIndex >= 0) {
      const existingVote = votes[existingVoteIndex];
      wasUpVote = existingVote.vote === 'up';
      wasDownVote = existingVote.vote === 'down';
      votes.splice(existingVoteIndex, 1);
    }
    
    // Add new vote
    const newVote: Vote = {
      ideaId,
      voterUid: userUid,
      voterEmail: userEmail,
      vote: vote as 'up' | 'down',
      votedAt: new Date().toISOString()
    };
    votes.push(newVote);
    
    // Update idea vote counts
    const updatedIdea: Idea = {
      ...idea,
      votesUp: (idea.votesUp || 0) - (wasUpVote ? 1 : 0) + (vote === 'up' ? 1 : 0),
      votesDown: (idea.votesDown || 0) - (wasDownVote ? 1 : 0) + (vote === 'down' ? 1 : 0),
      updatedAt: new Date().toISOString()
    };
    
    await upsertIdeas([updatedIdea]);
    
    return NextResponse.json({
      success: true,
      votesUp: updatedIdea.votesUp,
      votesDown: updatedIdea.votesDown,
      userVote: vote
    });
    
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ideaId = searchParams.get('ideaId');
  const userUid = searchParams.get('userUid');
  
  if (!ideaId) {
    return NextResponse.json({ error: 'ideaId is required' }, { status: 400 });
  }
  
  // Get vote counts for the idea
  const ideaVotes = votes.filter(v => v.ideaId === ideaId);
  const votesUp = ideaVotes.filter(v => v.vote === 'up').length;
  const votesDown = ideaVotes.filter(v => v.vote === 'down').length;
  
  // Get user's vote if userUid provided
  let userVote = null;
  if (userUid) {
    const userVoteRecord = votes.find(v => v.ideaId === ideaId && v.voterUid === userUid);
    userVote = userVoteRecord?.vote || null;
  }
  
  return NextResponse.json({
    ideaId,
    votesUp,
    votesDown,
    userVote
  });
}