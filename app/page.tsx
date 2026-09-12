import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isValidLocale, locales, type Locale } from "@/lib/i18n/config";

/**
 * L'arrel del domini NO és cap pantalla pròpia: només decideix cap a on
 * enviar la persona.
 *   - Si ja ha iniciat sessió → directament a l'aplicació (/app), sense
 *     fer-li veure la landing cada cop que hi entra.
 *   - Si no → a la landing pública en l'idioma més adequat (/ca o /es),
 *     que és la que Google ha d'indexar.
 */
export default async function RootRedirectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  // Llegim la cookie directament (no via getLocale()) perquè aquí ens cal
  // distingir "no hi ha preferència guardada encara" de "el valor per
  // defecte és ca" — getLocale() ja col·lapsa els dos casos a propòsit
  // per a la resta de l'app, on això no importa.
  const cookieValue = (await cookies()).get("locale")?.value;
  if (cookieValue && isValidLocale(cookieValue)) {
    redirect(`/${cookieValue}`);
  }

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const preferred = locales.find((l) => acceptLanguage.includes(l)) as
    | Locale
    | undefined;

  redirect(`/${preferred ?? defaultLocale}`);
}
