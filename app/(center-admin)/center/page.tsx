import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Card } from "@/components/ui/card";

export default async function CenterDashboard() {
  const { supabase, profile } = await requireRole("center_admin");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { data: center } = await supabase
    .from("centers")
    .select("name, join_code")
    .eq("id", profile.center_id)
    .single();

  // Aquestes dues consultes les permet la policy "L'admin del centre veu
  // els perfils/pacients del seu centre" (migració 0012_centers.sql) —
  // no calen filtres addicionals al client, RLS ja ho limita al centre.
  const { data: therapists } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "therapist")
    .eq("center_id", profile.center_id);

  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name, status, therapist_id")
    .eq("center_id", profile.center_id);

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink-900">
        {center?.name ?? dict.center.title}
      </h1>

      <Card className="mb-6">
        <p className="text-sm text-ink-400">{dict.center.joinCodeLabel}</p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-wider text-brand-600">
          {center?.join_code}
        </p>
        <p className="mt-2 text-xs text-ink-400">{dict.center.joinCodeHint}</p>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-700">
            {dict.center.therapistsTitle} ({(therapists ?? []).length})
          </h2>
          <div className="space-y-2">
            {(therapists ?? []).map((t) => (
              <Card key={t.id}>
                <p className="text-sm font-medium text-ink-900">
                  {t.full_name}
                </p>
              </Card>
            ))}
            {(therapists ?? []).length === 0 && (
              <p className="text-sm text-ink-400">
                {dict.center.noTherapists}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-700">
            {dict.center.patientsTitle} ({(patients ?? []).length})
          </h2>
          <div className="space-y-2">
            {(patients ?? []).map((p) => (
              <Card key={p.id}>
                <p className="text-sm font-medium text-ink-900">
                  {p.first_name} {p.last_name}
                </p>
                <span
                  className={
                    p.status === "active"
                      ? "text-xs text-progress-600"
                      : "text-xs text-ink-400"
                  }
                >
                  {p.status === "active" ? "Actiu" : "Inactiu"}
                </span>
              </Card>
            ))}
            {(patients ?? []).length === 0 && (
              <p className="text-sm text-ink-400">{dict.center.noPatients}</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-ink-400">
        Des d&apos;aquí encara no es poden reassignar pacients entre
        logopedes ni veure&apos;n el detall clínic (objectius, exercicis) —
        queda com a següent pas, si el necessiteu.
      </p>
    </div>
  );
}
