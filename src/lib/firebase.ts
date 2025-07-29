// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc } from "firebase/firestore";
// getAuth foi removido pois não será mais usado
// import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "unisport-hub",
  appId: "1:624944069747:web:87dce41348b1f075c53e06",
  storageBucket: "unisport-hub.firebasestorage.app",
  apiKey: "AIzaSyB5Mib6QHdLrGkHmN-Cf3JGrmOM7GjIsWU",
  authDomain: "unisport-hub.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "624944069747"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// const auth = getAuth(app); // Removido

export { app, db };
