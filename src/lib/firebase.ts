import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  deviceId: string;
  model: string;
  osVersion: string;
  lastSeen: string;
  status: "online" | "offline";
  pairingCode?: string;
}

export interface WindowConfig {
  id: string;
  name: string;
  type: "floating" | "keyboard" | "accessibility" | "overlay";
  data: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Error Handler
export function handleFirestoreError(error: any, operationType: string, path: string | null = null) {
  const authInfo = {
    userId: auth.currentUser?.uid || "anonymous",
    email: auth.currentUser?.email || "",
    emailVerified: auth.currentUser?.emailVerified || false,
    isAnonymous: auth.currentUser?.isAnonymous || false,
    providerInfo: auth.currentUser?.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName || "",
      email: p.email || ""
    })) || []
  };

  const errorInfo = {
    error: error.message,
    operationType,
    path,
    authInfo
  };

  console.error("Firestore Error:", JSON.stringify(errorInfo, null, 2));
  throw new Error(JSON.stringify(errorInfo));
}
