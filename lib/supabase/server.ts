import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database.types";

/**
 * Client de Supabase per fer servir dins de Server Components, Server Actions
 * i Route Handlers. Respecta la sessió de l'usuari (cookies), per tant totes
 * les policies de RLS s'apliquen correctament amb `auth.uid()`.
 *
 * IMPORTANT: no memoritzar aquest client entre requests — cal crear-ne un de
 * nou a cada petició perquè les cookies canvien per usuari.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Es pot ignorar si es crida des d'un Server Component (no pot
            // escriure cookies); el middleware ja s'encarrega de refrescar-les.
          }
        },
      },
    }
  );
}
