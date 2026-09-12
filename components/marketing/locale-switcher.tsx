import Link from "next/link";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

/**
 * A diferència del LocaleSwitcher de l'app (que canvia una cookie sense
 * navegar), aquí cada idioma és una URL real (/ca, /es). És el que permet
 * que Google indexi cada idioma per separat — un canvi de cookie és
 * invisible per als motors de cerca.
 */
export function MarketingLocaleSwitcher({ current }: { current: Locale }) {
  return (
    <div className="flex gap-1 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          className={
            l === current
              ? "rounded-lg bg-ink-100 px-2 py-1 font-medium text-ink-900"
              : "rounded-lg px-2 py-1 text-ink-400 hover:text-ink-700"
          }
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
