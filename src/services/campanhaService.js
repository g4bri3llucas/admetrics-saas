import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export async function getCampanhas(clientId) {
  const q = query(
    collection(db, "campanhas"),
    where("clientId", "==", clientId),
    orderBy("data", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getTodasCampanhas() {
  const snap = await getDocs(collection(db, "campanhas"))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function criarCampanha(dados) {
  await addDoc(collection(db, "campanhas"), {
    ...dados,
    createdAt: serverTimestamp(),
  })
}

export async function editarCampanha(id, dados) {
  await updateDoc(doc(db, "campanhas", id), dados)
}

export async function excluirCampanha(id) {
  await deleteDoc(doc(db, "campanhas", id))
}