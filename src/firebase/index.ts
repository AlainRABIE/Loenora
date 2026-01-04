import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;

// Initialize Firebase
// The check for getApps ensures that we only initialize the app once
const initializeFirebase = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
};

const app = initializeFirebase();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app as firebaseApp, auth, firestore };
export * from './provider';
export * from './auth/use-user';
