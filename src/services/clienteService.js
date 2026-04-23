import { supabase } from "./supabase"

// ── Get all clients ────────────────────────────────────────────────────────
export async function getClientes() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// ── Get single client by ID ────────────────────────────────────────────────
export async function getCliente(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// ── Update client profile ──────────────────────────────────────────────────
export async function updateCliente(id, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Delete client ──────────────────────────────────────────────────────────
export async function deleteCliente(id) {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)

  if (error) throw error
}