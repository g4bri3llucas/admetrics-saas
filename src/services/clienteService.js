import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore"
import { db } from "./firebase"

export async function getClientes() {
  const q = query(collection(db, "users"), where("role", "==", "client"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function editarCliente(id, dados) {
  await updateDoc(doc(db, "users", id), dados)
}

export async function excluirCliente(id) {
  await deleteDoc(doc(db, "users", id))
}