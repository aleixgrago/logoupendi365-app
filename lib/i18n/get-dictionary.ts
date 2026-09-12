import ca from "./dictionaries/ca.json";
import es from "./dictionaries/es.json";
import type { Locale } from "./config";

// Els diccionaris són JSON estàtics, empaquetats pel bundler de Next.js:
// no calen imports dinàmics ni cap petició de xarxa, per tant la funció
// és síncrona i es pot cridar tant des de Server com Client Components.
const dictionaries = { ca, es } satisfies Record<Locale, unknown>;

export type Dictionary = typeof ca;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Interpolació molt senzilla per a claus com "Hola, {name}". No es fa
 * servir cap llibreria d'i18n (react-intl, next-intl...) perquè amb 2
 * idiomes i sense plurals complexos no aporta prou valor per la
 * complexitat que afegiria — si el projecte creix a molts idiomes amb
 * plurals/gèneres, val la pena revisar aquesta decisió.
 */
export function t(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}
