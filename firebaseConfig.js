// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase web config
const firebaseConfig = {
  apiKey: "AIzaSyCRQItl91bs3P_9ONbWG4YoVIv610H2K1A",
  authDomain: "kitchenpal-a9889.firebaseapp.com",
  projectId: "kitchenpal-a9889",
  storageBucket: "kitchenpal-a9889.appspot.com",
  messagingSenderId: "347820722977",
  appId: "1:347820722977:web:a4bbd85d4460fa63fc0c60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with browser persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { app, auth, db };
