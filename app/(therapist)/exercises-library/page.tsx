import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { localeNames } from "@/lib/i18n/config";

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fàcil",
  medium: "Mitjana",
  hard: "Difícil",
};

// Paleta cíclica per donar un color diferent a cada categoria — purament
// visual, no té relació amb cap dada clínica.
const GROUP_STYLES = [
  { dot: "bg-fun-500", border: "border-fun-200", heading: "text-fun-600" },
  { dot: "bg-coral-500", border: "border-coral-200", heading: "text-coral-600" },
  { dot: "bg-progress-400", border: "border-progress-100", heading: "text-progress-600" },
  { dot: "bg-sunny-500", border: "border-sunny-400", heading: "text-ink-700" },
];

export default async function ExercisesLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string;
    category?: string;
    difficulty?: string;
    age?: string;
  }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { lang, category, difficulty, age } = await searchParams;

  // Categories: taxonomia de referència, visible per a tothom (RLS ho
  // permet a qualsevol usuari autenticat).
  const { data: categories } = await supabase
    .from("disorder_categories")
    .select("id, slug, group_key, name_ca, name_es")
    .order("group_key", { ascending: true });

  // Exercicis: els propis del logopeda (therapist_id = jo) MÉS les
  // plantilles compartides (therapist_id null) sembrades a la biblioteca
  // de referència. Sense aquest "or", les plantilles no es veurien mai.
  let query = supabase
    .from("exercises")
    .select("*, disorder_categories(id, name_ca, name_es, group_key)")
    .or(`therapist_id.eq.${profile.id},therapist_id.is.null`)
    .order("created_at", { ascending: false });

  if (lang === "ca" || lang === "es") query = query.eq("language", lang);
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") {
    query = query.eq("difficulty", difficulty);
  }
  if (category) {
    const match = (categories ?? []).find((c) => c.slug === category);
    if (match) query = query.eq("disorder_category_id", match.id);
  }
  const ageNum = age ? Number(age) : null;
  if (ageNum !== null && !Number.isNaN(ageNum)) {
    // Un exercici encaixa si l'edat cau dins [min_age, max_age], tractant
    // un límit null com "sense restricció" en aquell extrem.
    query = query
      .or(`min_age.is.null,min_age.lte.${ageNum}`)
      .or(`max_age.is.null,max_age.gte.${ageNum}`);
  }

  const { data: exercises } = await query;

  // Agrupació per categoria per mostrar-ho organitzat per trastorn, tal
  // com es va demanar. Els exercicis sense categoria (creats abans
  // d'aquesta funcionalitat) van a un grup "Sense categoria" al final.
  const grouped = new Map<string, { label: string; items: typeof exercises }>();
  for (const ex of exercises ?? []) {
    const cat = ex.disorder_categories as {
      name_ca: string;
      name_es: string;
    } | null;
    const key = cat ? cat.name_ca : "__none__";
    const label = cat ? cat.name_ca : "Sense categoria";
    if (!grouped.has(key)) grouped.set(key, { label, items: [] as any });
    grouped.get(key)!.items!.push(ex);
  }

  function buildFilterUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const current = { lang, category, difficulty, age, ...overrides };
    for (const [k, v] of Object.entries(current)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/exercises-library?${qs}` : "/exercises-library";
  }

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

      <Card className="mb-6">
        <form className="grid grid-cols-2 gap-3 sm:grid-cols-4" method="get">
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          >
            <option value="">Totes les categories</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name_ca}
              </option>
            ))}
          </select>

          <select
            name="difficulty"
            defaultValue={difficulty ?? ""}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          >
            <option value="">Qualsevol dificultat</option>
            <option value="easy">Fàcil</option>
            <option value="medium">Mitjana</option>
            <option value="hard">Difícil</option>
          </select>

          <input
            type="number"
            name="age"
            min={0}
            max={18}
            defaultValue={age ?? ""}
            placeholder="Edat del nen/a"
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />

          <select
            name="lang"
            defaultValue={lang ?? ""}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          >
            <option value="">Qualsevol idioma</option>
            <option value="ca">Català</option>
            <option value="es">Castellà</option>
          </select>

          <div className="col-span-2 flex gap-2 sm:col-span-4">
            <Button type="submit">Filtrar</Button>
            <Link href="/exercises-library">
              <Button type="button" variant="secondary">
                Netejar filtres
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {[...grouped.entries()].map(([key, group], groupIndex) => {
        const style = GROUP_STYLES[groupIndex % GROUP_STYLES.length];
        return (
        <div key={key} className="mb-8">
          <h2 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${style.heading}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
            {group.label}{" "}
            <span className="font-normal text-ink-400">
              ({group.items!.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {group.items!.map((ex: any) => (
              <Card key={ex.id} className={style.border}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-ink-900">{ex.title}</h3>
                  <div className="flex shrink-0 gap-1">
                    {ex.therapist_id === null && (
                      <span
                        className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-600"
                        title="Exercici de la biblioteca de referència compartida"
                      >
                        Plantilla
                      </span>
                    )}
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                      {localeNames[ex.language as "ca" | "es"]}
                    </span>
                  </div>
                </div>
                {ex.description && (
                  <p className="mt-1 text-sm text-ink-700">{ex.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-400">
                  {ex.estimated_minutes && <span>{ex.estimated_minutes} min</span>}
                  {ex.recommended_frequency && (
                    <span>{ex.recommended_frequency}</span>
                  )}
                  {ex.difficulty && (
                    <span className="rounded-full bg-ink-50 px-2 py-0.5">
                      {DIFFICULTY_LABELS[ex.difficulty] ?? ex.difficulty}
                    </span>
                  )}
                  {(ex.min_age !== null || ex.max_age !== null) && (
                    <span>
                      {ex.min_age ?? 0}–{ex.max_age ?? "∞"} anys
                    </span>
                  )}
                </div>
                {(ex.materials || (ex.steps && ex.steps.length > 0)) && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-brand-600">
                      Materials i passos
                    </summary>
                    <div className="mt-2 space-y-2 border-l-2 border-ink-100 pl-3">
                      {ex.materials && (
                        <p className="text-ink-700">
                          <span className="font-medium">Material: </span>
                          {ex.materials}
                        </p>
                      )}
                      {ex.steps && ex.steps.length > 0 && (
                        <ol className="list-decimal space-y-1 pl-4 text-ink-700">
                          {ex.steps.map((s: { instruction: string; tip: string }, i: number) => (
                            <li key={i}>
                              {s.instruction}
                              {s.tip && (
                                <span className="block text-xs italic text-ink-400">
                                  {s.tip}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </details>
                )}
              </Card>
            ))}
          </div>
        </div>
        );
      })}

      {(exercises ?? []).length === 0 && (
        <p className="text-sm text-ink-400">
          Cap exercici coincideix amb aquests filtres.{" "}
          <Link href="/exercises-library" className="text-brand-600 hover:underline">
            Netejar filtres
          </Link>
          .
        </p>
      )}

      <p className="mt-8 text-xs text-ink-400">
        Els exercicis marcats com a <strong>Plantilla</strong> formen part
        d&apos;una biblioteca inicial de referència pensada per no començar
        de zero — revisa&apos;ls i adapta&apos;ls al teu criteri clínic
        abans d&apos;assignar-los a un pacient real.
      </p>
    </div>
  );
}
