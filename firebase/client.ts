// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW9j1wXRgKGYYznSslQGC5zJcNfVjR5Ek",
  authDomain: "interviewroom-42cb4.firebaseapp.com",
  projectId: "interviewroom-42cb4",
  storageBucket: "interviewroom-42cb4.firebasestorage.app",
  messagingSenderId: "703232496057",
  appId: "1:703232496057:web:6e641aedb412ff74dba668",
  measurementId: "G-2RYX96M0Z7"
};

// Initialize Firebase
const app = !getApp.length? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);