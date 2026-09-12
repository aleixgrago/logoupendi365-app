import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";

export default async function ParentDashboard() {
  const { supabase, profile } = await requireRole("parent");

  const { data: children } = await supabase
    .from("patient_guardians")
    .select("patients(id, first_name, last_name)")
    .eq("parent_id", profile.id);

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink-900">
        Hola, {profile.full_name.split(" ")[0]}
      </h1>

      <div className="space-y-3">
        {(children ?? []).map((c) => {
          const patient = Array.isArray(c.patients) ? c.patients[0] : c.patients;
          if (!patient) return null;
          return (
            <Link key={patient.id} href={`/children/${patient.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <p className="font-medium text-ink-900">
                  {patient.first_name} {patient.last_name}
                </p>
                <p className="mt-1 text-sm text-ink-400">
                  Veure objectius i exercicis →
                </p>
              </Card>
            </Link>
          );
        })}
        {(children ?? []).length === 0 && (
          <p className="text-sm text-ink-400">
            Encara no tens cap infant vinculat. El teu logopeda t&apos;hi ha
            de donar accés.
          </p>
        )}
      </div>
    </div>
  );
}
