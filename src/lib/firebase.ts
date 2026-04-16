import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);

// ローカル開発時は Firestore Emulator に接続
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_EMULATOR === "true"
) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

/** Firebase Analytics（ブラウザ環境かつ measurementId が設定されている場合のみ初期化） */
export async function initAnalytics(): Promise<Analytics | null> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(app);
}
