import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import type { Invitation } from '@/lib/types';

// In-memory storage for invitations (migrate to Firestore later)
const invitations = new Map<string, Invitation>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviterId, inviterEmail, ideaId } = body;
    
    if (!inviterId || !inviterEmail || !ideaId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 15);
    
    const invitation: Invitation = {
      id: inviteCode,
      inviterId,
      inviterEmail,
      ideaId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      inviteCode,
    };
    
    invitations.set(inviteCode, invitation);
    
    return NextResponse.json({
      success: true,
      inviteCode,
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inviteCode}`,
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteCode = searchParams.get('code');
    
    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code required' },
        { status: 400 }
      );
    }
    
    const invitation = invitations.get(inviteCode);
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, inviteeEmail } = body;
    
    if (!inviteCode || !inviteeEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const invitation = invitations.get(inviteCode);
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation' },
        { status: 404 }
      );
    }
    
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Invitation already used' },
        { status: 400 }
      );
    }
    
    // Update invitation
    invitation.inviteeEmail = inviteeEmail;
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date().toISOString();
    
    invitations.set(inviteCode, invitation);
    
    // TODO: Unlock execution pack for both users
    // TODO: Send notification to inviter
    
    return NextResponse.json({
      success: true,
      message: 'Invitation accepted successfully',
      ideaId: invitation.ideaId,
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}