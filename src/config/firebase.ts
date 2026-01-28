import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2lBfb1IWzG4guZmFtNcXx-n8T2OvC3Po",
  authDomain: "corsa-n.firebaseapp.com",
  projectId: "corsa-n",
  storageBucket: "corsa-n.firebasestorage.app",
  messagingSenderId: "617278790724",
  appId: "1:617278790724:web:eb628dfe902f9036b4f011"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
