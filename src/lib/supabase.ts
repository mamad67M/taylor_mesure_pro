import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Sanitize the URL in case the user accidentally included extra paths, slashes, or spaces
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, '');
  if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1', '');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey.trim());
