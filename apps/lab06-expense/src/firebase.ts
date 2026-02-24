import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAQuc-oHW4mG93k05UtlkYg7SoZbFEguo",
  authDomain: "lab06-ionicfirebase.firebaseapp.com",
  projectId: "lab06-ionicfirebase"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);