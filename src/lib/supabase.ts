import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
  // Provide fallback values for development
  const fallbackUrl = 'https://your-project.supabase.co';
  const fallbackKey = 'your-anon-key';
  
  // Create client with fallback values
  supabase = createClient(fallbackUrl, fallbackKey);
} else {
  // Create client with actual environment variables
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };