// app/api/test/route.ts
export async function GET() {
  return new Response(JSON.stringify({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectIdClient: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    ingestToken: !!process.env.INGEST_TOKEN,
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
