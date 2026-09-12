import { requireRole } from "@/lib/auth/guards";
import { createPatient } from "../actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function NewPatientPage() {
  await requireRole("therapist");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-ink-900">Nou pacient</h1>

      <Card>
        <form action={createPatient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Nom
              </label>
              <Input name="first_name" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Cognoms
              </label>
              <Input name="last_name" required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Data de naixement
            </label>
            <Input type="date" name="birth_date" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Diagnòstic (opcional)
            </label>
            <Input name="diagnosis" placeholder="p. ex. Dislàlia" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Idioma de treball preferit (opcional)
            </label>
            <select
              name="preferred_language"
              defaultValue=""
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            >
              <option value="">Sense preferència</option>
              <option value="ca">Català</option>
              <option value="es">Castellà</option>
            </select>
            <p className="mt-1 text-xs text-ink-400">
              Es fa servir com a valor per defecte en crear objectius i
              assignar exercicis a aquest pacient.
            </p>
          </div>

          <Button type="submit" className="w-full">
            Crear pacient
          </Button>
        </form>
      </Card>
    </div>
  );
}
