import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
}

interface ExerciseOption {
  id: string;
  title: string;
}

interface ClinicalSession {
  id: string;
  session_date: string;
  duration_minutes: number | null;
  activities: string | null;
  evolution: string | null;
  next_steps: string | null;
  notes: string | null;
  participation: "low" | "medium" | "high" | null;
  evolution_rating: "no_change" | "mild_improvement" | "significant_improvement" | null;
  family_summary: string | null;
  clinical_summary: string | null;
  family_summary_status: "pending" | "draft" | "approved";
}

const PARTICIPATION_LABELS = { low: "Baixa", medium: "Mitjana", high: "Alta" };
const EVOLUTION_LABELS = {
  no_change: "Sense canvis",
  mild_improvement: "Lleu millora",
  significant_improvement: "Millora significativa",
};
const STATUS_LABELS = {
  pending: "Resum pendent de generar",
  draft: "Esborrany — pendent d'aprovació",
  approved: "Aprovat, visible per la família",
};

export function ClinicalSessionsSection({
  sessions,
  goals,
  exercises,
  action,
  approveAction,
  regenerateAction,
}: {
  sessions: ClinicalSession[];
  goals: Goal[];
  exercises: ExerciseOption[];
  action: (formData: FormData) => void;
  approveAction: (sessionId: string) => void;
  regenerateAction: (sessionId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {sessions.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink-900">
                {new Date(s.session_date).toLocaleDateString("ca")}
              </p>
              {s.duration_minutes && (
                <span className="text-xs text-ink-400">{s.duration_minutes} min</span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {s.participation && (
                <span className="rounded-full bg-fun-100 px-2 py-0.5 text-fun-600">
                  Participació: {PARTICIPATION_LABELS[s.participation]}
                </span>
              )}
              {s.evolution_rating && (
                <span className="rounded-full bg-progress-100 px-2 py-0.5 text-progress-600">
                  {EVOLUTION_LABELS[s.evolution_rating]}
                </span>
              )}
            </div>

            {s.activities && (
              <p className="mt-2 text-sm text-ink-700">
                <span className="font-medium">Activitats: </span>
                {s.activities}
              </p>
            )}
            {s.next_steps && (
              <p className="mt-1 text-sm text-ink-700">
                <span className="font-medium">Recomanacions per casa: </span>
                {s.next_steps}
              </p>
            )}

            <div className="mt-3 rounded-xl bg-ink-50 p-3">
              <p className="text-xs font-medium text-ink-400">
                {STATUS_LABELS[s.family_summary_status]}
              </p>
              {s.family_summary && (
                <p className="mt-1 text-sm text-ink-700">{s.family_summary}</p>
              )}
              {s.clinical_summary && (
                <p className="mt-2 text-xs italic text-ink-400">
                  Intern (no visible per la família): {s.clinical_summary}
                </p>
              )}
              {s.family_summary_status === "draft" && (
                <form action={approveAction.bind(null, s.id)} className="mt-2">
                  <Button type="submit" variant="secondary">
                    Aprovar per a la família
                  </Button>
                </form>
              )}
              {s.family_summary_status === "pending" && (
                <form action={regenerateAction.bind(null, s.id)} className="mt-2">
                  <Button type="submit" variant="secondary">
                    Generar resum ara
                  </Button>
                </form>
              )}
            </div>
          </Card>
        ))}
        {sessions.length === 0 && (
          <p className="text-sm text-ink-400">Encara no hi ha cap sessió registrada.</p>
        )}
      </div>

      <Card id="nova-sessio">
        <h3 className="mb-3 text-sm font-medium text-ink-900">
          Finalitzar sessió
        </h3>
        <form action={action} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="session_date"
              required
              className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="duration_minutes"
              min={1}
              placeholder="Durada (min)"
              className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            />
          </div>

          {goals.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-ink-700">Objectius treballats</p>
              <div className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center gap-1 rounded-lg border border-ink-100 px-2 py-1 text-xs text-ink-700"
                  >
                    <input type="checkbox" name="goal_ids" value={g.id} />
                    {g.title}
                  </label>
                ))}
              </div>
            </div>
          )}

          {exercises.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-ink-700">Exercicis treballats</p>
              <div className="flex flex-wrap gap-2">
                {exercises.map((ex) => (
                  <label
                    key={ex.id}
                    className="flex items-center gap-1 rounded-lg border border-ink-100 px-2 py-1 text-xs text-ink-700"
                  >
                    <input type="checkbox" name="exercise_ids" value={ex.id} />
                    {ex.title}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-medium text-ink-700">Participació del nen</p>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((v) => (
                <label key={v} className="flex-1">
                  <input type="radio" name="participation" value={v} className="peer sr-only" />
                  <span className="block cursor-pointer rounded-lg border border-ink-100 py-1.5 text-center text-xs peer-checked:border-fun-500 peer-checked:bg-fun-100">
                    {PARTICIPATION_LABELS[v]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-ink-700">Evolució observada</p>
            <div className="flex gap-2">
              {(["no_change", "mild_improvement", "significant_improvement"] as const).map((v) => (
                <label key={v} className="flex-1">
                  <input type="radio" name="evolution_rating" value={v} className="peer sr-only" />
                  <span className="block cursor-pointer rounded-lg border border-ink-100 py-1.5 text-center text-xs peer-checked:border-progress-400 peer-checked:bg-progress-100">
                    {EVOLUTION_LABELS[v]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="activities"
            rows={2}
            placeholder="Activitats realitzades (breu)"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />
          <textarea
            name="next_steps"
            rows={2}
            placeholder="Recomanacions per casa"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />
          <textarea
            name="notes"
            rows={2}
            placeholder="Notes opcionals (només per a tu)"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />

          <Button type="submit" className="w-full">
            Finalitzar sessió
          </Button>
        </form>
      </Card>
    </div>
  );
}
