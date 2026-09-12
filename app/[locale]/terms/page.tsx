import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

const CONTENT: Record<Locale, { title: string; body: string }> = {
  ca: {
    title: "Termes i condicions",
    body: "Aquesta és una pàgina de marcador de posició. Redacta i fes revisar per un professional legal els termes reals (condicions d'ús, responsabilitat, cancel·lació, etc.) abans de fer-los servir amb usuaris reals o de començar a facturar.",
  },
  es: {
    title: "Términos y condiciones",
    body: "Esta es una página de marcador de posición. Redacta y haz revisar por un profesional legal los términos reales (condiciones de uso, responsabilidad, cancelación, etc.) antes de usarlos con usuarios reales o de empezar a facturar.",
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const content = CONTENT[rawLocale as Locale];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-4 text-2xl font-semibold text-ink-900">
        {content.title}
      </h1>
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-ink-700">
        {content.body}
      </p>
    </div>
  );
}
