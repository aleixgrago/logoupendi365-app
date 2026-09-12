"use client";

import { useEffect } from "react";

/**
 * L'etiqueta <html lang="..."> es defineix a app/layout.tsx (arrel real,
 * compartida amb l'app autenticada) i no rep el param `locale` d'aquest
 * segment dinàmic. Per no haver de duplicar tot el <html><body> aquí
 * (React no permet imbricar-los), l'ajustem des del client amb un efecte
 * mínim — suficient a efectes d'accessibilitat; Google ja infereix
 * l'idioma real pel contingut i per `hreflang`, que sí és correcte des
 * del primer render (veure generateMetadata a page.tsx).
 */
export function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
