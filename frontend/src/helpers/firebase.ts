import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhFCRRN-SSPGJcRa0yLArxEgchfrez0v4",
  authDomain: "rac-volley.firebaseapp.com",
  projectId: "rac-volley",
  storageBucket: "rac-volley.appspot.com",
  messagingSenderId: "592846376313",
  appId: "1:592846376313:web:1ced94a870b76706e5f3a8",
};

const app = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(app);
