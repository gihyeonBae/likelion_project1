import { SUPABASE_CONFIG } from './supabase-config.js';

const SUPABASE_JS_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let clientPromise = null;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

function getProjectUrl() {
  return new URL(SUPABASE_CONFIG.url).origin;
}

export async function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = import(SUPABASE_JS_CDN).then(({ createClient }) => createClient(
      getProjectUrl(),
      SUPABASE_CONFIG.anonKey,
    ));
  }

  return clientPromise;
}

export async function runSupabaseQuery(queryFactory, fallbackValue, label) {
  const client = await getSupabaseClient();

  if (!client) {
    return fallbackValue;
  }

  try {
    const { data, error } = await queryFactory(client);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.warn(`[Supabase] ${label} failed. Falling back to local data.`, error);
    return fallbackValue;
  }
}
