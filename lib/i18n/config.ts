// Llista d'idiomes SUPORTATS PER LA INTERFÍCIE (traduccions de botons,
// etiquetes, etc.). És independent de la llista d'idiomes de treball
// clínic (veure migració 0005_languages.sql) — no cal que creixin igual.
//
// PER AFEGIR UN IDIOMA NOU:
//   1. Afegeix el codi aquí (p. ex. "en").
//   2. Crea lib/i18n/dictionaries/en.json (copia ca.json com a plantilla
//      i tradueix cada clau — mai n'hi ha d'haver cap sense la seva parella).
//   3. Actualitza get-dictionary.ts amb la nova entrada.
//   4. No cal tocar cap component: tots llegeixen d'aquesta llista.
export const locales = ["ca", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ca";

export const localeNames: Record<Locale, string> = {
  ca: "Català",
  es: "Castellà",
};

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
