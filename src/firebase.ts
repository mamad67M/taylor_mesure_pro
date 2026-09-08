import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "astral-tuner-16shk",
  appId: "1:507748199987:web:94328c32ace4701faefd46",
  apiKey: "AIzaSyBanhes4OXFvqXO4JBOJsno5QJdZ7Xh_hE",
  authDomain: "astral-tuner-16shk.firebaseapp.com",
  storageBucket: "astral-tuner-16shk.firebasestorage.app",
  messagingSenderId: "507748199987",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
