# IdeaOasis MVP Starter

## Setup
1. Create `.env.local` with the following environment variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyASvk9X9d2v2bB4fkBYVf708r7FB8ZU7MM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ideaoasis-gpt5-1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ideaoasis-gpt5-1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ideaoasis-gpt5-1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=623382547830
NEXT_PUBLIC_FIREBASE_APP_ID=1:623382547830:web:57ecb3bd49669afd72fe57
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MLLBQ9DTWX
NEXT_PUBLIC_ADMIN_EMAILS=ethancho12@gmail.com

# Firebase Admin SDK (for Ingest API)
FIREBASE_PROJECT_ID=ideaoasis-gpt5-1
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ideaoasis-gpt5-1.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Ingest API Token (Bearer token for webhook authentication)
INGEST_TOKEN=ideaoasis_ingest_6f2c1a9f8eab47e6b3d2c45f9d7a1c84

## Environment Variables Setup

### Local Development (.env.local)
Copy the environment variables above to your `.env.local` file.

### Vercel Deployment
Add all environment variables to your Vercel project settings:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Make sure to include both client (NEXT_PUBLIC_*) and server (FIREBASE_*) variables
2. `npm install`
3. `npm run dev`

## Deploy to Vercel
- Add environment variables from above to Vercel project settings.
- Deploy.

## Firestore Rules
Deploy rules in `firestore.rules` to your Firebase project.

## Features
- **Voting Room**: View and vote on startup ideas
- **Top Picks**: See ideas ranked by votes
- **Idea Details**: View individual ideas with comments and AI summary
- **Admin Panel**: Manage ideas (admin only)
- **Google Auth**: Sign in with Google account
- **Connection Metadata**: Tags, use cases, and tech stack for better discovery
- **Related Ideas**: AI-powered recommendations based on tags
- **Ingest API**: Webhook endpoint for automated data ingestion with upsert support

## Ingest API Usage

### Authentication
Use Bearer token in Authorization header:
```bash
curl -X POST https://your-domain.vercel.app/api/ingest \
  -H "Authorization: Bearer $INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Single Item
```json
{
  "title": "TrustSwing: Used Golf Sim Market",
  "summary": "Verified marketplace for pre-owned golf simulators",
  "category": "Marketplace",
  "sourceURL": "https://example.com/idea",
  "sourcePlatform": "ideabrowser",
  "tags": ["golf", "marketplace"],
  "koreaFitScore": 4
}
```

### Batch Items
```json
[
  { "title": "Idea 1", "sourceURL": "..." },
  { "title": "Idea 2", "sourceURL": "..." }
]
```

### Response Format
```json
{
  "ok": true,
  "count": 2,
  "results": [
    { "id": "doc1", "mode": "new", "title": "Idea 1" },
    { "id": "doc2", "mode": "bySourceURL", "title": "Idea 2" }
  ]
}
```

## Notes
- Admin email is `ethancho12@gmail.com`
- Auth method: Google Only
- Real-time updates with Firestore
