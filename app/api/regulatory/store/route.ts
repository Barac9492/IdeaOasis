import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const internalHeader = req.headers.get('x-internal-api');
  
  if (internalHeader !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { updates } = await req.json();
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid updates data' }, { status: 400 });
    }

    const batch = db.batch();
    const regulatoryRef = db.collection('regulatory_updates');
    
    for (const update of updates) {
      const docRef = regulatoryRef.doc(update.id);
      batch.set(docRef, {
        ...update,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }
    
    await batch.commit();
    
    return NextResponse.json({
      success: true,
      stored: updates.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store regulatory updates' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry');
    const impact = searchParams.get('impact');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = db.collection('regulatory_updates')
      .orderBy('publishedDate', 'desc')
      .limit(limit);
    
    if (industry) {
      query = query.where('industries', 'array-contains', industry);
    }
    
    if (impact) {
      query = query.where('businessImpact', '==', impact);
    }
    
    const snapshot = await query.get();
    const updates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      updates,
      count: updates.length
    });
    
  } catch (error) {
    console.error('Retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve regulatory updates' },
      { status: 500 }
    );
  }
}