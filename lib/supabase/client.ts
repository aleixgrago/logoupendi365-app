import { createBrowserClient } from "@supabase/ssr";

/**
 * Client de Supabase per fer servir dins de Client Components ("use client").
 * Fes-lo servir només quan calgui interactivitat en temps real al navegador
 * (p. ex. subscripcions). Per la resta de casos, prioritza Server Components
 * + Server Actions amb lib/supabase/server.ts — és més segur i més ràpid.
 *
 * NOTA: sense el genèric <Database> a propòsit — veure el comentari a
 * lib/supabase/server.ts per l'explicació completa.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
