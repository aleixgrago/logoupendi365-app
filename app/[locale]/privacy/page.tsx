import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

const CONTENT: Record<Locale, { title: string; body: string }> = {
  ca: {
    title: "Política de privacitat",
    body: "Aquesta és una pàgina de marcador de posició. Abans de sortir de la fase de beta privada i, especialment, abans de tractar dades reals de pacients menors d'edat, aquest text ha de ser redactat i revisat per un professional legal especialitzat en RGPD i dades de salut. No et basis en aquest text per a cap ús real.",
  },
  es: {
    title: "Política de privacidad",
    body: "Esta es una página de marcador de posición. Antes de salir de la fase de beta privada y, especialmente, antes de tratar datos reales de pacientes menores de edad, este texto debe ser redactado y revisado por un profesional legal especializado en RGPD y datos de salud. No te bases en este texto para ningún uso real.",
  },
};

export default async function PrivacyPage({
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
