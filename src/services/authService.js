import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { initializeApp, deleteApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { auth, db } from "./firebase"

export async function login(email, senha) {
  const credential = await signInWithEmailAndPassword(auth, email, senha)
  return credential.user
}

export async function logout() {
  await signOut(auth)
}

export async function criarCliente({ nome, empresa, email, senha }) {
  const config = auth.app.options
  const appSecundario = initializeApp(config, "criacao-cliente-" + Date.now())
  const authSecundario = getAuth(appSecundario)

  try {
    const credential = await createUserWithEmailAndPassword(
      authSecundario,
      email,
      senha
    )
    const uid = credential.user.uid

    await setDoc(doc(db, "users", uid), {
      nome,
      empresa,
      email,
      role: "client",
      createdAt: serverTimestamp(),
    })

    return uid
  } finally {
    await deleteApp(appSecundario)
  }
}