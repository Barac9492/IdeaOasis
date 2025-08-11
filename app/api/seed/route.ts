// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedData';

export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is only allowed in development mode' },
        { status: 403 }
      );
    }
    
    const ideas = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      count: ideas.length,
      ideas: ideas.map(idea => ({
        id: idea.id,
        title: idea.title,
        sector: idea.sector
      }))
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed the database',
    available: process.env.NODE_ENV !== 'production'
  });
}