// app/api/ideas/seed/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedData';
import { resetSeeding } from '@/lib/db';

export async function POST() {
  try {
    // Reset and force re-seed with enhanced data
    resetSeeding();
    await seedDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully with enhanced scores' 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, { status: 500 });
  }
}