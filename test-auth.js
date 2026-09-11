import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5VEBt6kE8vznP3M1fnSuIqlmj1jShdsw",
  authDomain: "mesurepro.firebaseapp.com",
  projectId: "mesurepro",
  storageBucket: "mesurepro.firebasestorage.app",
  messagingSenderId: "247001259728",
  appId: "1:247001259728:web:81b07368e0daf8d8e448d5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function check() {
  try {
    await signInWithEmailAndPassword(auth, "mam.diallo163@gmail.com", "azerty"); // Dummy pass, might fail, just testing if we can at least reach it
    console.log("Signed in:", auth.currentUser.uid);
  } catch (e) {
    console.error("Auth error:", e.message);
  }
}
check();
