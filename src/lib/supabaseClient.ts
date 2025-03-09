import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL oder API-Key fehlt! Stelle sicher, dass .env.local richtig gesetzt ist.");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
