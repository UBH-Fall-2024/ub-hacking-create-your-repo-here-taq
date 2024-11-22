import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ijcorhcaxkyxheioiqti.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqY29yaGNheGt5eGhlaW9pcXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjkxMzYsImV4cCI6MjA0Njc0NTEzNn0.a5jb9HY-Sx6u4AgpxM9ctTtTfD44DVOuSHYjT3wH3Us";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
