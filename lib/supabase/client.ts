import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

/**
 * Client de Supabase per fer servir dins de Client Components ("use client").
 * Fes-lo servir només quan calgui interactivitat en temps real al navegador
 * (p. ex. subscripcions). Per la resta de casos, prioritza Server Components
 * + Server Actions amb lib/supabase/server.ts — és més segur i més ràpid.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
