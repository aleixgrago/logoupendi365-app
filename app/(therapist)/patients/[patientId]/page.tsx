import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createGoal,
  assignExercise,
  uploadDocument,
  linkGuardian,
} from "./actions";
import { localeNames } from "@/lib/i18n/config";

const TABS = [
  { key: "summary", label: "Resum" },
  { key: "goals", label: "Objectius" },
  { key: "exercises", label: "Exercicis" },
  { key: "documents", label: "Documents" },
  { key: "history", label: "Historial" },
] as const;

export default async function PatientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ tab?: string; lang?: string }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { patientId } = await params;
  const { tab = "summary", lang } = await searchParams;
  const langFilter = lang === "ca" || lang === "es" ? lang : null;

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .eq("therapist_id", profile.id) // redundant amb RLS, però explícit i clar
    .single();

  if (!patient) {
    notFound();
  }

  // Registre d'auditoria: cada cop que el logopeda obre la fitxa. Necessari
  // per poder respondre "qui ha vist aquestes dades i quan" en una auditoria.
  await supabase.from("history_events").insert({
    patient_id: patient.id,
    event_type: "patient_viewed",
    created_by: profile.id,
  });

  let goalsQuery = supabase
    .from("goals")
    .select("*")
    .eq("patient_id", patientId)
    .order("start_date", { ascending: false });
  if (tab === "goals" && langFilter) {
    goalsQuery = goalsQuery.eq("language", langFilter);
  }
  const { data: goals } = await goalsQuery;

  const { data: assignments } =
    tab === "exercises"
      ? await (async () => {
          let q = supabase
            .from("exercise_assignments")
            .select("*, exercises!inner(title, estimated_minutes, language)")
            .eq("patient_id", patientId)
            .order("assigned_date", { ascending: false });
          if (langFilter) q = q.eq("exercises.language", langFilter);
          return q;
        })()
      : { data: null };

  const { data: exerciseOptions } =
    tab === "exercises"
      ? await (async () => {
          let q = supabase
            .from("exercises")
            .select("id, title, language")
            .eq("therapist_id", profile.id);
          if (langFilter) q = q.eq("language", langFilter);
          return q;
        })()
      : { data: null };

  const { data: documents } =
    tab === "documents"
      ? await supabase
          .from("documents")
          .select("*")
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false })
      : { data: null };

  const { data: historyEvents } =
    tab === "history"
      ? await supabase
          .from("history_events")
          .select("*")
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false })
          .limit(100)
      : { data: null };

  const { data: guardians } =
    tab === "summary"
      ? await supabase
          .from("patient_guardians")
          .select("parent_id, profiles(full_name)")
          .eq("patient_id", patientId)
      : { data: null };

  const boundCreateGoal = createGoal.bind(null, patientId);
  const boundAssignExercise = assignExercise.bind(null, patientId);
  const boundUploadDocument = uploadDocument.bind(null, patientId);
  const boundLinkGuardian = linkGuardian.bind(null, patientId);

  const EVENT_LABELS: Record<string, string> = {
    patient_created: "Pacient donat d'alta",
    patient_viewed: "Fitxa consultada pel logopeda",
    goal_created: "Nou objectiu creat",
    exercise_assigned: "Exercici assignat",
    document_uploaded: "Document pujat",
    exercise_completed_by_parent: "Exercici marcat com fet pel pare/tutor",
  };

  return (
    <div>
      <div className="mb-1 text-sm text-ink-400">
        <Link href="/patients" className="hover:text-brand-600">
          ← Pacients
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-ink-900">
        {patient.first_name} {patient.last_name}
      </h1>

      <div className="mb-6 flex gap-1 border-b border-ink-100">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/patients/${patientId}?tab=${t.key}`}
            className={
              tab === t.key
                ? "border-b-2 border-brand-500 px-3 py-2 text-sm font-medium text-brand-600"
                : "px-3 py-2 text-sm text-ink-400 hover:text-ink-700"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "summary" && (
        <Card>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-400">Data de naixement</dt>
              <dd className="text-ink-900">{patient.birth_date}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Estat</dt>
              <dd className="text-ink-900">
                {patient.status === "active" ? "Actiu" : "Inactiu"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-ink-400">Diagnòstic</dt>
              <dd className="text-ink-900">{patient.diagnosis ?? "—"}</dd>
            </div>
          </dl>
        </Card>
      )}

      {tab === "summary" && (
        <Card className="mt-4">
          <h3 className="mb-3 text-sm font-medium text-ink-900">
            Pares/tutors amb accés
          </h3>
          <ul className="mb-4 space-y-1 text-sm text-ink-700">
            {(guardians ?? []).map((g) => (
              <li key={g.parent_id}>
                {(Array.isArray(g.profiles) ? g.profiles[0] : g.profiles)
                  ?.full_name ?? "—"}
              </li>
            ))}
            {(guardians ?? []).length === 0 && (
              <li className="text-ink-400">Encara no hi ha cap tutor vinculat.</li>
            )}
          </ul>
          <form action={boundLinkGuardian} className="flex gap-2">
            <Input
              type="email"
              name="email"
              required
              placeholder="email del pare/tutor (ja registrat)"
              className="max-w-xs"
            />
            <Button type="submit" variant="secondary">
              Vincular
            </Button>
          </form>
        </Card>
      )}

      {tab === "goals" && (
        <div className="space-y-6">
          <div className="flex gap-2 text-sm">
            <Link
              href={`/patients/${patientId}?tab=goals`}
              className={!langFilter ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Tots
            </Link>
            <Link
              href={`/patients/${patientId}?tab=goals&lang=ca`}
              className={langFilter === "ca" ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Català
            </Link>
            <Link
              href={`/patients/${patientId}?tab=goals&lang=es`}
              className={langFilter === "es" ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Castellà
            </Link>
          </div>

          <div className="space-y-3">
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
                {g.description && (
                  <p className="mt-1 text-sm text-ink-700">{g.description}</p>
                )}
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
                Encara no hi ha objectius definits per aquest pacient.
              </p>
            )}
          </div>

          <Card>
            <h3 className="mb-3 text-sm font-medium text-ink-900">
              Nou objectiu
            </h3>
            <form action={boundCreateGoal} className="space-y-3">
              <Input name="title" required placeholder="p. ex. Pronunciar la R" />
              <textarea
                name="description"
                rows={2}
                placeholder="Descripció (opcional)"
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <select
                name="language"
                defaultValue={patient.preferred_language ?? "ca"}
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
              >
                <option value="ca">Català</option>
                <option value="es">Castellà</option>
              </select>
              <Button type="submit">Afegir objectiu</Button>
            </form>
          </Card>
        </div>
      )}

      {tab === "exercises" && (
        <div className="space-y-6">
          <div className="flex gap-2 text-sm">
            <Link
              href={`/patients/${patientId}?tab=exercises`}
              className={!langFilter ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Tots
            </Link>
            <Link
              href={`/patients/${patientId}?tab=exercises&lang=ca`}
              className={langFilter === "ca" ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Català
            </Link>
            <Link
              href={`/patients/${patientId}?tab=exercises&lang=es`}
              className={langFilter === "es" ? "font-medium text-brand-600" : "text-ink-400"}
            >
              Castellà
            </Link>
          </div>

          <div className="space-y-3">
            {(assignments ?? []).map((a) => (
              <Card key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-900">
                      {a.exercises?.title ?? "Exercici eliminat"}
                    </p>
                    {a.exercises?.language && (
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-700">
                        {localeNames[a.exercises.language as "ca" | "es"]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400">
                    Assignat el {a.assigned_date}
                  </p>
                </div>
                <span
                  className={
                    a.status === "completed"
                      ? "rounded-full bg-progress-100 px-2 py-0.5 text-xs text-progress-600"
                      : a.status === "in_progress"
                      ? "rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-600"
                      : "rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-400"
                  }
                >
                  {a.status === "completed"
                    ? "Completat"
                    : a.status === "in_progress"
                    ? "En curs"
                    : "Pendent"}
                </span>
              </Card>
            ))}
            {(assignments ?? []).length === 0 && (
              <p className="text-sm text-ink-400">
                Encara no hi ha exercicis assignats{langFilter ? " en aquest idioma" : ""}.
              </p>
            )}
          </div>

          <Card>
            <h3 className="mb-3 text-sm font-medium text-ink-900">
              Assignar exercici
            </h3>
            {(exerciseOptions ?? []).length === 0 ? (
              <p className="text-sm text-ink-400">
                Encara no tens cap exercici
                {langFilter ? ` en ${localeNames[langFilter]}` : ""} a la teva{" "}
                <Link
                  href="/exercises-library/new"
                  className="text-brand-600 hover:underline"
                >
                  biblioteca
                </Link>
                . Crea&apos;n un abans d&apos;assignar.
              </p>
            ) : (
              <form action={boundAssignExercise} className="flex gap-2">
                <select
                  name="exercise_id"
                  required
                  className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
                >
                  {(exerciseOptions ?? []).map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({localeNames[ex.language as "ca" | "es"]})
                    </option>
                  ))}
                </select>
                <Button type="submit">Assignar</Button>
              </form>
            )}
          </Card>
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-6">
          <div className="space-y-2">
            {(documents ?? []).map((d) => (
              <Card key={d.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink-900">{d.file_name}</p>
                  <p className="text-xs text-ink-400">
                    Pujat el {new Date(d.created_at).toLocaleDateString("ca")}
                  </p>
                </div>
                <a href={`/api/documents/${d.id}/download`} target="_blank">
                  <Button type="button" variant="secondary">
                    Descarregar
                  </Button>
                </a>
              </Card>
            ))}
            {(documents ?? []).length === 0 && (
              <p className="text-sm text-ink-400">
                Encara no hi ha documents pujats.
              </p>
            )}
          </div>

          <Card>
            <h3 className="mb-3 text-sm font-medium text-ink-900">
              Pujar document
            </h3>
            <form action={boundUploadDocument} className="flex gap-2">
              <input
                type="file"
                name="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                className="flex-1 text-sm"
              />
              <Button type="submit">Pujar</Button>
            </form>
            <p className="mt-2 text-xs text-ink-400">
              PDF, JPG, PNG o DOCX. Màxim 10MB.
            </p>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-4 border-l border-ink-100 pl-4">
          {(historyEvents ?? []).map((ev) => (
            <div key={ev.id} className="relative">
              <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-brand-500" />
              <p className="text-sm font-medium text-ink-900">
                {EVENT_LABELS[ev.event_type] ?? ev.event_type}
              </p>
              <p className="text-xs text-ink-400">
                {new Date(ev.created_at).toLocaleString("ca")}
              </p>
            </div>
          ))}
          {(historyEvents ?? []).length === 0 && (
            <p className="text-sm text-ink-400">Sense esdeveniments encara.</p>
          )}
        </div>
      )}
    </div>
  );
}
