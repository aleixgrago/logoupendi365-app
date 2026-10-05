import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Goal {
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
}

export function ClinicalSessionsSection({
  sessions,
  goals,
  action,
}: {
  sessions: ClinicalSession[];
  goals: Goal[];
  action: (formData: FormData) => void;
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
                <span className="text-xs text-ink-400">
                  {s.duration_minutes} min
                </span>
              )}
            </div>
            {s.activities && (
              <p className="mt-2 text-sm text-ink-700">
                <span className="font-medium">Activitats: </span>
                {s.activities}
              </p>
            )}
            {s.evolution && (
              <p className="mt-1 text-sm text-ink-700">
                <span className="font-medium">Evolució: </span>
                {s.evolution}
              </p>
            )}
            {s.next_steps && (
              <p className="mt-1 text-sm text-ink-700">
                <span className="font-medium">Properes accions: </span>
                {s.next_steps}
              </p>
            )}
          </Card>
        ))}
        {sessions.length === 0 && (
          <p className="text-sm text-ink-400">
            Encara no hi ha cap sessió registrada.
          </p>
        )}
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-medium text-ink-900">
          Nova sessió
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
              <p className="mb-1 text-xs font-medium text-ink-700">
                Objectius treballats
              </p>
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

          <textarea
            name="activities"
            rows={2}
            placeholder="Activitats realitzades"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />
          <textarea
            name="evolution"
            rows={2}
            placeholder="Evolució observada"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />
          <textarea
            name="next_steps"
            rows={2}
            placeholder="Properes accions"
            className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
          />

          <Button type="submit">Desar sessió</Button>
        </form>
      </Card>
    </div>
  );
}
