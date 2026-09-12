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
    .select("*, exercises!inner(title, description, estimated_minutes, language)")
    .eq("patient_id", patientId)
    .order("assigned_date", { ascending: false });
  if (langFilter) assignmentsQuery = assignmentsQuery.eq("exercises.language", langFilter);
  const { data: assignments } = await assignmentsQuery;

  const boundComplete = completeAssignment.bind(null, patientId);

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
          className={!langFilter ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Totes
        </Link>
        <Link
          href={`/children/${patientId}?lang=ca`}
          className={langFilter === "ca" ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Català
        </Link>
        <Link
          href={`/children/${patientId}?lang=es`}
          className={langFilter === "es" ? "font-medium text-brand-600" : "text-ink-400"}
        >
          Castellà
        </Link>
      </div>

      <h2 className="mb-3 text-sm font-medium text-ink-700">
        Objectius actius
      </h2>
      <div className="mb-8 space-y-3">
        {(goals ?? []).map((g) => (
          <Card key={g.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-ink-900">{g.title}</h3>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                  {localeNames[g.language as "ca" | "es"]}
                </span>
              </div>
              <span className="text-sm text-progress-600">
                {g.progress_pct}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-ink-100">
              <div
                className="h-2 rounded-full bg-progress-400"
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

      <h2 className="mb-3 text-sm font-medium text-ink-700">Exercicis</h2>
      <div className="space-y-3">
        {(assignments ?? []).map((a) => (
          <Card key={a.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-900">
                    {a.exercises?.title}
                  </p>
                  {a.exercises?.language && (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                      {localeNames[a.exercises.language as "ca" | "es"]}
                    </span>
                  )}
                </div>
                {a.exercises?.description && (
                  <p className="mt-1 text-sm text-ink-700">
                    {a.exercises.description}
                  </p>
                )}
                {a.exercises?.estimated_minutes && (
                  <p className="mt-1 text-xs text-ink-400">
                    ~{a.exercises.estimated_minutes} min
                  </p>
                )}
              </div>

              {a.status === "completed" ? (
                <span className="rounded-full bg-progress-100 px-3 py-1 text-xs font-medium text-progress-600">
                  ✓ Completat
                </span>
              ) : (
                <form action={boundComplete}>
                  <input type="hidden" name="assignment_id" value={a.id} />
                  <Button type="submit">Marcar com fet</Button>
                </form>
              )}
            </div>
          </Card>
        ))}
        {(assignments ?? []).length === 0 && (
          <p className="text-sm text-ink-400">
            Encara no hi ha exercicis assignats{langFilter ? " en aquest idioma" : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
