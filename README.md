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
```
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

## Notes
- Admin email is `ethancho12@gmail.com`
- Auth method: Google Only
- Real-time updates with Firestore
