import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let _db: FirebaseFirestore.Firestore | null = null;

export function getAdminDb() {
  if (_db) return _db;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing FIREBASE_* env for admin SDK");
  }

  // 더 강력한 줄바꿈 처리
  let privateKey = privateKeyRaw;
  
  // Vercel 환경변수에서 \n이 실제 줄바꿈으로 변환되지 않은 경우 처리
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  
  // 멀티라인 형식이 아닌 경우 줄바꿈 추가
  if (!privateKey.includes('\n')) {
    privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '-----BEGIN PRIVATE KEY-----\n');
    privateKey = privateKey.replace(/-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');
    privateKey = privateKey.replace(/(.{64})/g, '$1\n');
  }

  try {
    // 기존 앱이 있으면 새로 초기화하지 않음
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    
    _db = getFirestore();
    return _db;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error(`Firebase Admin SDK failed: ${error.message}`);
  }
}
