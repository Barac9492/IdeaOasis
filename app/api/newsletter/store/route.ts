import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const internalHeader = req.headers.get('x-internal-api');
  
  if (internalHeader !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { newsletter } = await req.json();
    
    if (!newsletter || !newsletter.id) {
      return NextResponse.json({ error: 'Invalid newsletter data' }, { status: 400 });
    }

    const newslettersRef = db.collection('newsletters');
    const docRef = newslettersRef.doc(newsletter.id);
    
    await docRef.set({
      ...newsletter,
      storedAt: new Date().toISOString()
    }, { merge: true });
    
    return NextResponse.json({
      success: true,
      id: newsletter.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Newsletter storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store newsletter' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    let query = db.collection('newsletters')
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const newsletters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      newsletters,
      count: newsletters.length
    });
    
  } catch (error) {
    console.error('Newsletter retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve newsletters' },
      { status: 500 }
    );
  }
}