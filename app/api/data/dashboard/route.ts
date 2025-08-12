import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const range = searchParams.get('range') || '7d';

    // Mock data - replace with actual data fetching
    const data = Array.from({ length: 10 }, (_, i) => ({
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 5000) + 1000,
      category: Math.random() > 0.5 ? 'A' : 'B',
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }));

    const filteredData = filter === 'all' ? data : data.filter(item => item.category === filter);

    return NextResponse.json({
      success: true,
      data: filteredData,
      filter,
      range
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}