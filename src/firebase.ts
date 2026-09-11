import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5VEBt6kE8vznP3M1fnSuIqlmj1jShdsw",
  authDomain: "mesurepro.firebaseapp.com",
  projectId: "mesurepro",
  storageBucket: "mesurepro.firebasestorage.app",
  messagingSenderId: "247001259728",
  appId: "1:247001259728:web:81b07368e0daf8d8e448d5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be cleared in one tab at a a time.
    console.warn("Firebase persistence failed: Multiple tabs open.");
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn("Firebase persistence not supported by this browser.");
  }
});
