import { NextRequest, NextResponse } from 'next/server';
import Plunk from '@plunk/node';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  if (!process.env.PLUNK_API_KEY) {
    return NextResponse.json({ error: 'Plunk API key not configured' }, { status: 500 });
  }
  
  const plunk = new Plunk(process.env.PLUNK_API_KEY);
  
  try {
    // Try the simplest possible email send
    const result = await plunk.emails.send({
      to: email,
      subject: 'Test Email from IdeaOasis',
      body: '<h1>Hello!</h1><p>This is a test email from IdeaOasis newsletter system.</p>',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      result: result
    });
  } catch (error: any) {
    console.error('Plunk send error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to send email',
      details: error
    }, { status: 500 });
  }
}