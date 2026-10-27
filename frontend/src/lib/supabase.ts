import { createClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Initializes Supabase Client using centralized configuration.
 * Client-side requests are scoped by Row Level Security (RLS) policies.
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.publishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
