import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import firebaseConfigProd from "./firebaseConfig.prod";

const firebaseConfig = firebaseConfigProd;

// Inicializa o app Firebase (faça isso só uma vez)
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
export const analytics = getAnalytics(app); // Analytics (leitura)
export const db = getFirestore(app);        // Firestore
export const auth = getAuth(app);           // Auth
export const storage = getStorage(app);     // Storage

// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export default app;