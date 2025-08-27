// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore }from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "legaleagle-b6n9l",
  "appId": "1:24593612887:web:6511645f82216539006312",
  "storageBucket": "legaleagle-b6n9l.firebasestorage.app",
  "apiKey": "AIzaSyB5_0r6wqcFbc_nNP6UD2zUts6wZ5h-IO8",
  "authDomain": "legaleagle-b6n9l.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "24593612887"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { app, db };
