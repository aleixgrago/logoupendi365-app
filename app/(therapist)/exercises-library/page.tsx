import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { localeNames } from "@/lib/i18n/config";

export default async function ExercisesLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { lang } = await searchParams;

  let query = supabase
    .from("exercises")
    .select("*")
    .eq("therapist_id", profile.id)
    .order("created_at", { ascending: false });

  if (lang === "ca" || lang === "es") {
    query = query.eq("language", lang);
  }

  const { data: exercises } = await query;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink-900">
          Biblioteca d&apos;exercicis
        </h1>
        <Link href="/exercises-library/new">
          <Button>+ Nou exercici</Button>
        </Link>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        <Link
          href="/exercises-library"
          className={!lang ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Tots
        </Link>
        <Link
          href="/exercises-library?lang=ca"
          className={lang === "ca" ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Català
        </Link>
        <Link
          href="/exercises-library?lang=es"
          className={lang === "es" ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Castellà
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(exercises ?? []).map((ex) => (
          <Card key={ex.id}>
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-ink-900">{ex.title}</h3>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                {localeNames[ex.language as "ca" | "es"]}
              </span>
            </div>
            {ex.description && (
              <p className="mt-1 text-sm text-ink-700">{ex.description}</p>
            )}
            <div className="mt-3 flex gap-3 text-xs text-ink-400">
              {ex.estimated_minutes && <span>{ex.estimated_minutes} min</span>}
              {ex.recommended_frequency && (
                <span>{ex.recommended_frequency}</span>
              )}
            </div>
          </Card>
        ))}
        {(exercises ?? []).length === 0 && (
          <p className="text-sm text-ink-400">
            Encara no tens cap exercici a la teva biblioteca.
          </p>
        )}
      </div>
    </div>
  );
}
