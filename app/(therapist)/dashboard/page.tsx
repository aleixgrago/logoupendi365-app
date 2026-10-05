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
        <Card className="border-fun-200 bg-gradient-to-br from-fun-50 to-white">
          <p className="text-sm text-ink-700">{dict.dashboard.activePatients}</p>
          <p className="mt-1 text-3xl font-bold text-fun-600">
            {activePatients ?? 0}
          </p>
        </Card>
        <Card className="border-progress-100 bg-gradient-to-br from-progress-100/60 to-white">
          <p className="text-sm text-ink-700">{dict.dashboard.assignmentsWeek}</p>
          <p className="mt-1 text-3xl font-bold text-progress-600">
            {assignmentsThisWeek ?? 0}
          </p>
        </Card>
        <Card
          className={
            staleCount > 0
              ? "border-coral-400 bg-gradient-to-br from-coral-100 to-white"
              : "border-sunny-400 bg-gradient-to-br from-sunny-100 to-white"
          }
        >
          <p className="text-sm text-ink-700">{dict.dashboard.staleCount}</p>
          <p className="mt-1 text-3xl font-bold text-coral-600">
            {staleCount}
          </p>
        </Card>
      </div>
    </div>
  );
}
