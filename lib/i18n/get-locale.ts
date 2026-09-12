import { cookies } from "next/headers";
import { defaultLocale, isValidLocale, type Locale } from "./config";

const LOCALE_COOKIE = "locale";

/**
 * Font de la veritat per a l'idioma actual: una cookie de llarga durada.
 * Es tria deliberadament NO fer routing amb prefix d'idioma (/ca/..., /es/...)
 * perquè aquesta és una aplicació autenticada, no un lloc públic multi-idioma
 * amb necessitats de SEO per idioma — afegir-hi el prefix ara seria
 * complexitat sense benefici real per al producte actual.
 *
 * `profiles.locale` (a la base de dades) queda preparat per si en el futur
 * cal sincronitzar la preferència entre dispositius; de moment la cookie
 * és suficient i molt més simple.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;

  if (value && isValidLocale(value)) {
    return value;
  }

  return defaultLocale;
}

export { LOCALE_COOKIE };
