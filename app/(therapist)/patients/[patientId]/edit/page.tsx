import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { updatePatient } from "../../actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { patientId } = await params;

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .eq("therapist_id", profile.id)
    .single();

  if (!patient) notFound();

  const boundUpdate = updatePatient.bind(null, patientId);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-1 text-sm text-ink-400">
        <Link href={`/patients/${patientId}`} className="hover:text-fun-600">
          ← Tornar a la fitxa
        </Link>
      </div>
      <h1 className="mb-6 text-lg font-semibold text-ink-900">
        Editar pacient
      </h1>

      <Card>
        <form action={boundUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Nom
              </label>
              <Input name="first_name" required defaultValue={patient.first_name} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Cognoms
              </label>
              <Input name="last_name" required defaultValue={patient.last_name} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Data de naixement
            </label>
            <Input
              type="date"
              name="birth_date"
              required
              defaultValue={patient.birth_date}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Diagnòstic (opcional)
            </label>
            <Input name="diagnosis" defaultValue={patient.diagnosis ?? ""} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Motiu de consulta (opcional)
            </label>
            <Input
              name="referral_reason"
              defaultValue={patient.referral_reason ?? ""}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Antecedents rellevants (opcional)
            </label>
            <Input
              name="relevant_background"
              defaultValue={patient.relevant_background ?? ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Idioma de treball preferit
              </label>
              <select
                name="preferred_language"
                defaultValue={patient.preferred_language ?? ""}
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
              >
                <option value="">Sense preferència</option>
                <option value="ca">Català</option>
                <option value="es">Castellà</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Estat
              </label>
              <select
                name="status"
                defaultValue={patient.status}
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
              >
                <option value="active">Actiu</option>
                <option value="inactive">Inactiu</option>
              </select>
            </div>
          </div>

          <SubmitButton className="w-full" pendingLabel="Desant...">
            Desar canvis
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}
