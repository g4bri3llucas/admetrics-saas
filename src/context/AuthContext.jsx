import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,       setUser]       = useState(null)
  const [perfil,     setPerfil]     = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Fetch profile row from public.users
  async function fetchPerfil(supabaseUser) {
    if (!supabaseUser) {
      setPerfil(null)
      return
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        setPerfil(null)
      } else {
        console.log("Profile loaded:", data)
        setPerfil(data)
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err)
      setPerfil(null)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session:", session?.user?.email ?? "none")
      setUser(session?.user ?? null)
      await fetchPerfil(session?.user ?? null)
      setCarregando(false)
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session?.user?.email ?? "none")
        setUser(session?.user ?? null)
        await fetchPerfil(session?.user ?? null)
        setCarregando(false)
      }
    )

    return () => subscription.unsubscribe()
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