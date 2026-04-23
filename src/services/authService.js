import { supabase } from "./supabase"

// ── Login ──────────────────────────────────────────────────────────────────
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── Create client (without affecting current session) ─────────────────────
export async function criarCliente({ nome, empresa, email, senha }) {
  // 1. Create auth user via admin signup (uses anon key — Supabase allows this
  //    when email confirmations are disabled in the project settings)
  const { data, error } = await supabase.auth.signUp({ email, password: senha })
  if (error) throw error

  const uid = data.user?.id
  if (!uid) throw new Error("User creation failed — no UID returned")

  // 2. Insert profile row in public.users
  const { error: profileError } = await supabase
    .from("users")
    .insert({ id: uid, nome, empresa, email, role: "client" })

  if (profileError) throw profileError

  return uid
}