import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase environment variables are not configured');
  }
  return { url, anon };
}

export function createBrowserSupabase(): SupabaseClient {
  const { url, anon } = getSupabaseEnv();
  return createClient(url, anon);
}


