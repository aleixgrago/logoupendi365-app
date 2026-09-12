import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, t } from "@/lib/i18n/get-dictionary";
import { Card } from "@/components/ui/card";

export default async function TherapistDashboard() {
  const { supabase, profile } = await requireRole("therapist");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { count: activePatients } = await supabase
    .from("patients")
    .select("id", { count: "exact", head: true })
    .eq("therapist_id", profile.id)
    .eq("status", "active");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { count: assignmentsThisWeek } = await supabase
    .from("exercise_assignments")
    .select("id, patients!inner(therapist_id)", { count: "exact", head: true })
    .eq("patients.therapist_id", profile.id)
    .gte("assigned_date", oneWeekAgo.toISOString().slice(0, 10));

  // KPI clau de negoci: pacients sense cap activitat en 14 dies. És el que
  // detecta abandonament abans que el logopeda se n'adoni manualment.
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const { data: recentEvents } = await supabase
    .from("history_events")
    .select("patient_id, patients!inner(therapist_id)")
    .eq("patients.therapist_id", profile.id)
    .gte("created_at", twoWeeksAgo.toISOString());

  const activePatientIdsRecently = new Set(
    (recentEvents ?? []).map((e) => e.patient_id)
  );

  const { data: allActivePatients } = await supabase
    .from("patients")
    .select("id")
    .eq("therapist_id", profile.id)
    .eq("status", "active");

  const staleCount = (allActivePatients ?? []).filter(
    (p) => !activePatientIdsRecently.has(p.id)
  ).length;

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink-900">
        {t(dict.dashboard.greeting, { name: profile.full_name.split(" ")[0] })}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-400">{dict.dashboard.activePatients}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">
            {activePatients ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-400">{dict.dashboard.assignmentsWeek}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">
            {assignmentsThisWeek ?? 0}
          </p>
        </Card>
        <Card className={staleCount > 0 ? "border-amber-300 bg-amber-50" : ""}>
          <p className="text-sm text-ink-400">{dict.dashboard.staleCount}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">
            {staleCount}
          </p>
        </Card>
      </div>
    </div>
  );
}
