import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app = null;
let dbInstance = null;
let authInstance = null;

try {
  const firebaseConfig = {
    projectId: "balmy-haven-5vxch",
    appId: "1:943077997436:web:1b81c0ece704f384e382f9",
    apiKey: "AIzaSyAmOrj3Elh5VTiZYXUcuHN_DrV3kS1qKJc",
    authDomain: "balmy-haven-5vxch.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-finalfurmodernfu-38ab0f63-9663-4b8f-a78e-47bacf2579a5",
    storageBucket: "balmy-haven-5vxch.firebasestorage.app",
    messagingSenderId: "943077997436"
  };

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const databaseId = "ai-studio-finalfurmodernfu-38ab0f63-9663-4b8f-a78e-47bacf2579a5";
  dbInstance = getFirestore(app, databaseId);
  authInstance = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization notice:', err);
}

export const db = dbInstance;
export const auth = authInstance;

// Attach to window for MonitoringService or console diagnostics
if (typeof window !== 'undefined') {
  window.firebaseDb = db;
}
