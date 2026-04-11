import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD7BhneREB-xVA261_Pssd58sjZdIl55ak",
  authDomain: "traffic-dashboard-9244c.firebaseapp.com",
  projectId: "traffic-dashboard-9244c",
  storageBucket: "traffic-dashboard-9244c.firebasestorage.app",
  messagingSenderId: "7892436288",
  appId: "1:7892436288:web:abbbda510b40f3bd8fa6a5"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)