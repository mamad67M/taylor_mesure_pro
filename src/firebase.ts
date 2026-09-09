import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration

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
