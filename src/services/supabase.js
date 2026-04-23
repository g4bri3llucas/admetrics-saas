import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fdlkstzxnocdhgdmxedu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGtzdHp4bm9jZGhnZG14ZWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDg5NzgsImV4cCI6MjA5MjUyNDk3OH0.5lMvXhoRVFywht4_YYkXe2EOWLFuw4rPZLxcGioJdS0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)