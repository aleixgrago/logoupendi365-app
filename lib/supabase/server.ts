import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client de Supabase per fer servir dins de Server Components, Server Actions
 * i Route Handlers. Respecta la sessió de l'usuari (cookies), per tant totes
 * les policies de RLS s'apliquen correctament amb `auth.uid()`.
 *
 * NOTA: no s'aplica el genèric <Database> aquí a propòsit. El fitxer
 * lib/types/database.types.ts està escrit a mà (encara no hi ha un projecte
 * Supabase real per generar-lo automàticament) i diverses versions recents
 * d'@supabase/supabase-js han anat canviant l'estructura interna exacta que
 * exigeixen (Relationships, Views, Enums, CompositeTypes...), cosa que ha
 * provocat una sèrie d'errors de build difícils de perseguir sense poder
 * executar el compilador en un entorn real. Un cop tinguis el projecte
 * Supabase creat, executa `npm run gen:types`, torna a afegir
 * `createServerClient<Database>` aquí, i tindràs autocompletat i seguretat
 * de tipus real i correcta — generada, no escrita a mà.
 *
 * IMPORTANT: no memoritzar aquest client entre requests — cal crear-ne un de
 * nou a cada petició perquè les cookies canvien per usuari.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: any }[]
        ) {
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
