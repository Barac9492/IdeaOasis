// app/api/ideas/seed/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedData';

export async function POST() {
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