// lib/firebaseAdmin.ts
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

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

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
}
