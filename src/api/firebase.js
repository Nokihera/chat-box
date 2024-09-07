// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyBy-QxPAjt_7gJxHJZi8QDrzsuvqvlCBwA",
  authDomain: "chat-box-server-a840c.firebaseapp.com",
  projectId: "chat-box-server-a840c",
  storageBucket: "chat-box-server-a840c.appspot.com",
  messagingSenderId: "967121534169",
  appId: "1:967121534169:web:a513ff2acf102604d312c8",
  measurementId: "G-MZ9NS1G2BV"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);