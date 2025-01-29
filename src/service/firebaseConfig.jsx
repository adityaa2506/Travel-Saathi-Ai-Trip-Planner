// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv6RgvlWO7Ugo__WKkzuEL33PDZ6APxOo",
  authDomain: "trip-saathi-ai-trip-planner.firebaseapp.com",
  projectId: "trip-saathi-ai-trip-planner",
  storageBucket: "trip-saathi-ai-trip-planner.firebasestorage.app",
  messagingSenderId: "1019850617196",
  appId: "1:1019850617196:web:53506bb2e3e02c8773c349"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);