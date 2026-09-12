"use client";

import { useTransition } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { setLocale } from "@/app/actions/locale";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.set("locale", e.target.value);
    startTransition(() => {
      setLocale(formData);
    });
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Idioma / Idioma de la interfície"
      className="rounded-lg border border-ink-100 bg-white px-2 py-1 text-sm text-ink-700"
    >
      {locales.map((l: Locale) => (
        <option key={l} value={l}>
          {localeNames[l]}
        </option>
      ))}
    </select>
  );
}
