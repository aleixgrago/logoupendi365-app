import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeAssignment } from "./actions";
import { localeNames } from "@/lib/i18n/config";

export default async function ChildDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { supabase, profile } = await requireRole("parent");
  const { patientId } = await params;
  const { lang } = await searchParams;
  const langFilter = lang === "ca" || lang === "es" ? lang : null;

  // RLS garanteix que aquesta select només retorna resultat si `profile.id`
  // és realment un guardian d'aquest patientId (taula patient_guardians).
  const { data: patient } = await supabase
    .from("patients")
    .select("id, first_name, last_name")
    .eq("id", patientId)
    .single();

  if (!patient) {
    notFound();
  }

  let goalsQuery = supabase
    .from("goals")
    .select("*")
    .eq("patient_id", patientId)
    .eq("status", "active");
  if (langFilter) goalsQuery = goalsQuery.eq("language", langFilter);
  const { data: goals } = await goalsQuery;

  let assignmentsQuery = supabase
    .from("exercise_assignments")
    .select(
      "*, exercises!inner(title, description, estimated_minutes, language, materials, steps)"
    )
    .eq("patient_id", patientId)
    .order("assigned_date", { ascending: false });
  if (langFilter) assignmentsQuery = assignmentsQuery.eq("exercises.language", langFilter);
  const { data: assignments } = await assignmentsQuery;

  const boundComplete = completeAssignment.bind(null, patientId);

  const pending = (assignments ?? []).filter((a) => a.status !== "completed");
  const completed = (assignments ?? []).filter((a) => a.status === "completed");

  return (
    <div>
      <div className="mb-1 text-sm text-ink-400">
        <Link href="/children" className="hover:text-brand-600">
          ← Els meus infants
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-ink-900">
        {patient.first_name} {patient.last_name}
      </h1>

      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-ink-400">Sessions a fer en:</span>
        <Link
          href={`/children/${patientId}`}
          className={!langFilter ? "font-medium text-fun-600" : "text-ink-400"}
        >
          Totes
        </Link>
        <Link
          href={`/children/${patientId}?lang=ca`}
          className={langFilter === "ca" ? "font-medium text-fun-600" : "text-ink-400"}
        >
          Català
        </Link>
        <Link
          href={`/children/${patientId}?lang=es`}
          className={langFilter === "es" ? "font-medium text-fun-600" : "text-ink-400"}
        >
          Castellà
        </Link>
      </div>

      <h2 className="mb-3 text-sm font-medium text-ink-700">
        Objectius actius
      </h2>
      <div className="mb-8 space-y-3">
        {(goals ?? []).map((g) => (
          <Card key={g.id} className="border-fun-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-ink-900">{g.title}</h3>
                <span className="rounded-full bg-fun-100 px-2 py-0.5 text-xs text-fun-600">
                  {localeNames[g.language as "ca" | "es"]}
                </span>
              </div>
              <span className="text-sm font-semibold text-progress-600">
                {g.progress_pct}%
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full rounded-full bg-ink-100">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-fun-400 to-progress-400"
                style={{ width: `${g.progress_pct}%` }}
              />
            </div>
          </Card>
        ))}
        {(goals ?? []).length === 0 && (
          <p className="text-sm text-ink-400">
            Encara no hi ha objectius actius{langFilter ? " en aquest idioma" : ""}.
          </p>
        )}
      </div>

      <h2 className="mb-3 text-sm font-medium text-ink-700">
        Avui toca fer 🎯
      </h2>
      <div className="mb-8 space-y-4">
        {pending.map((a) => {
          const ex = a.exercises;
          const steps = (ex?.steps ?? []) as { instruction: string; tip: string }[] | null;
          return (
            <Card
              key={a.id}
              className="border-2 border-coral-100 bg-gradient-to-br from-white to-coral-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-ink-900">
                      {ex?.title}
                    </p>
                    {ex?.language && (
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                        {localeNames[ex.language as "ca" | "es"]}
                      </span>
                    )}
                  </div>
                  {ex?.description && (
                    <p className="mt-1 text-sm text-ink-700">{ex.description}</p>
                  )}
                  {ex?.estimated_minutes && (
                    <p className="mt-1 text-xs text-ink-400">
                      ⏱️ Uns {ex.estimated_minutes} minuts
                    </p>
                  )}
                </div>
              </div>

              {ex?.materials && (
                <p className="mt-3 rounded-xl bg-sunny-100 px-3 py-2 text-sm text-ink-700">
                  <span className="font-semibold">🧰 Et caldrà: </span>
                  {ex.materials}
                </p>
              )}

              {steps && steps.length > 0 && (
                <ol className="mt-3 space-y-3">
                  {steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fun-500 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm text-ink-900">{s.instruction}</p>
                        {s.tip && (
                          <p className="text-xs italic text-ink-400">
                            💡 {s.tip}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <form action={boundComplete} className="mt-4">
                <input type="hidden" name="assignment_id" value={a.id} />
                <Button
                  type="submit"
                  className="w-full bg-coral-500 hover:bg-coral-600"
                >
                  🎉 Ja ho hem fet!
                </Button>
              </form>
            </Card>
          );
        })}
        {pending.length === 0 && (
          <p className="text-sm text-ink-400">
            No queda cap exercici pendent{langFilter ? " en aquest idioma" : ""}.
            Molt bona feina! 🎉
          </p>
        )}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium text-ink-700">
            Ja completats ✓
          </h2>
          <div className="space-y-2">
            {completed.map((a) => (
              <Card
                key={a.id}
                className="flex items-center justify-between bg-progress-100/40"
              >
                <p className="text-sm font-medium text-ink-900">
                  {a.exercises?.title}
                </p>
                <span className="rounded-full bg-progress-100 px-3 py-1 text-xs font-medium text-progress-600">
                  ✓ Fet
                </span>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
