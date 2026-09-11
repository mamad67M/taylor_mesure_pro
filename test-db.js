import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5VEBt6kE8vznP3M1fnSuIqlmj1jShdsw",
  authDomain: "mesurepro.firebaseapp.com",
  projectId: "mesurepro",
  storageBucket: "mesurepro.firebasestorage.app",
  messagingSenderId: "247001259728",
  appId: "1:247001259728:web:81b07368e0daf8d8e448d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const querySnapshot = await getDocs(collection(db, "clients"));
  console.log("Clients count:", querySnapshot.size);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}
check();
