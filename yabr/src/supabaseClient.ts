import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Check if variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Environment variables for Supabase URL or Anon Key are not defined.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
