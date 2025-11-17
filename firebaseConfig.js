
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRQItl91bs3P_9ONbWG4YoVIv610H2K1A",
  authDomain: "kitchenpal-a9889.firebaseapp.com",
  projectId: "kitchenpal-a9889",
  storageBucket: "kitchenpal-a9889.appspot.com",
  messagingSenderId: "347820722977",
  appId: "1:347820722977:web:a4bbd85d4460fa63fc0c60",
};

const app = initializeApp(firebaseConfig);

// ✅ Auth (Correct for React Native)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore with Offline Mode (Fixes Expo Timeout)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export { app, auth, db };
