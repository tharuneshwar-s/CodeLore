import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Determine the site URL based on the environment
let siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// In browser environments, use the current origin
if (typeof window !== 'undefined') {
  siteUrl = window.location.origin;
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // Explicitly set the site URL to ensure correct redirects
  }
});

export default supabase;