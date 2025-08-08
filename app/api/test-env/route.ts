// app/api/test-env/route.ts
export async function GET() {
  const privateKeySnippet = process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) + '...';  // 민감 정보 마스킹
  return new Response(JSON.stringify({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKeySnippet,
    privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    ingestToken: !!process.env.INGEST_TOKEN,
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
