// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Load Firebase client config from environment variables to avoid
// checking secrets into source control. Set these in your deployment
// (e.g. Vercel) or local `.env.local` as `NEXT_PUBLIC_...` variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase client app using env-configured values.
// The literal API key has been removed from the repository.
const app = initializeApp(firebaseConfig as any);
isSupported().then((supported) => {
  if (supported) {
    try {
      getAnalytics(app);
    } catch (e) {
      // analytics may not initialze in some environments
    }
  }
});
const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth(app);
export {
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAuth,
};

// Client-side helpers using Firestore directly with strict security rules.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

export async function fetchPantry() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const itemsRef = collection(db, 'pantries', user.uid, 'items');
  const q = query(itemsRef);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addPantryItem(item: Record<string, any>) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const itemsRef = collection(db, 'pantries', user.uid, 'items');
  const docRef = await addDoc(itemsRef, {
    ...item,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...item, createdAt: Date.now() };
}

export async function fetchSubcollection(sub: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const colRef = collection(db, 'pantries', user.uid, sub);
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addToSubcollection(sub: string, data: Record<string, any>) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const colRef = collection(db, 'pantries', user.uid, sub);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateSubcollectionDoc(sub: string, id: string, data: Record<string, any>) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const docRef = doc(db, 'pantries', user.uid, sub, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
}

export async function deleteSubcollectionDoc(sub: string, id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const docRef = doc(db, 'pantries', user.uid, sub, id);
  await deleteDoc(docRef);
  return { success: true };
}

export async function createOrUpdateUserProfile(data: Record<string, any>) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    { ...data, uid: user.uid, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return { id: user.uid, ...data };
}
