import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

/* =========================================================
   🔥 FIREBASE CONFIG
   PROJECT: undangan-wisuda-9e020
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyA3FK_ikT7XCmW_wXHnKOJkhHcZc9ZAGAk",
  authDomain: "undangan-digital-pernika-a6d58.firebaseapp.com",
  projectId: "undangan-digital-pernika-a6d58",
  storageBucket: "undangan-digital-pernika-a6d58.firebasestorage.app",
  messagingSenderId: "907487745240",
  appId: "1:907487745240:web:b4280e7842ae0ddaf273ad",
  measurementId: "G-GFBB6G676T"
};



/* =========================================================
   🚀 INITIALIZE FIREBASE
   ========================================================= */

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);


/* =========================================================
   🔥 FIRESTORE
   ========================================================= */

export const db = getFirestore(app);


/* =========================================================
   📊 ANALYTICS
   ========================================================= */

export const analyticsPromise =
  typeof window !== "undefined"
    ? isSupported().then((supported) => {
        if (supported) {
          return getAnalytics(app);
        }

        return null;
      })
    : Promise.resolve(null);


/* =========================================================
   📦 EXPORT APP
   ========================================================= */

export default app;