import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmEqvF5QAT7e0XmhpuZSDBzjXKypiFGyI",
  authDomain: "ideaoasis-gpt5-2.firebaseapp.com",
  projectId: "ideaoasis-gpt5-2",
  storageBucket: "ideaoasis-gpt5-2.firebasestorage.app",
  messagingSenderId: "381160980611",
  appId: "1:381160980611:web:cd8518b82f67643599dbb6"
};

export const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
