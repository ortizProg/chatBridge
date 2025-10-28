import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // o getDatabase para RealtimeDB

import { firebaseConfig } from "./firebase-config";

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
