// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore }from "firebase/firestore";

// Your web app's Firebase configuration is not available. 
// Please go to the Firebase console to generate it.
const firebaseConfig = {};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { app, db };
