import { NextResponse } from 'next/server';
import Plunk from '@plunk/node';

export async function GET() {
  const hasApiKey = !!process.env.PLUNK_API_KEY;
  const keyPrefix = process.env.PLUNK_API_KEY?.substring(0, 7) || 'not set';
  
  let plunkStatus = 'Not configured';
  let contactCount = 0;
  
  if (hasApiKey && process.env.PLUNK_API_KEY?.startsWith('sk_')) {
    try {
      const plunk = new Plunk(process.env.PLUNK_API_KEY);
      // Plunk SDK is initialized successfully if we get here
      plunkStatus = 'Connected successfully (ready to send emails)';
      // Note: Plunk doesn't provide a contacts.list() method in their API
    } catch (error: any) {
      plunkStatus = `Error: ${error.message || 'Failed to connect'}`;
    }
  } else if (hasApiKey && process.env.PLUNK_API_KEY?.startsWith('pk_')) {
    plunkStatus = 'Error: Using PUBLIC key instead of SECRET key';
  }
  
  return NextResponse.json({
    plunk: {
      configured: hasApiKey,
      status: plunkStatus,
      keyPrefix: keyPrefix,
      contactCount: contactCount,
      keyType: process.env.PLUNK_API_KEY?.startsWith('sk_') ? 'SECRET (correct)' : 
                process.env.PLUNK_API_KEY?.startsWith('pk_') ? 'PUBLIC (wrong!)' : 'not set'
    },
    publicKey: {
      configured: !!process.env.NEXT_PUBLIC_PLUNK_PUBLIC_KEY,
      prefix: process.env.NEXT_PUBLIC_PLUNK_PUBLIC_KEY?.substring(0, 7) || 'not set'
    },
    recommendation: !hasApiKey ? 
      'Add PLUNK_API_KEY to .env.local' : 
      process.env.PLUNK_API_KEY?.startsWith('pk_') ? 
        'You are using PUBLIC key (pk_) - you need SECRET key (sk_) for backend' :
        'Configuration looks good!'
  });
}