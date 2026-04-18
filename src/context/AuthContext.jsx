import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../services/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth mudou:", firebaseUser?.email ?? "deslogado")

      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid))
          console.log("Perfil encontrado:", snap.exists(), snap.data())
          setPerfil(snap.exists() ? snap.data() : null)
        } catch (err) {
          console.error("Erro ao buscar perfil:", err)
          setPerfil(null)
        }
      } else {
        setUser(null)
        setPerfil(null)
      }

      setCarregando(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, perfil, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}