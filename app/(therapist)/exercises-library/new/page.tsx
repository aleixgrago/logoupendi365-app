import { requireRole } from "@/lib/auth/guards";
import { createExercise } from "../actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function NewExercisePage() {
  await requireRole("therapist");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-ink-900">Nou exercici</h1>
      <Card>
        <form action={createExercise} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Títol
            </label>
            <Input name="title" required placeholder="p. ex. Pronunciar la R" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Descripció
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Durada estimada (min)
              </label>
              <Input type="number" name="estimated_minutes" min={1} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Freqüència recomanada
              </label>
              <Input
                name="recommended_frequency"
                placeholder="3 cops/setmana"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Idioma de l&apos;exercici
            </label>
            <select
              name="language"
              defaultValue="ca"
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            >
              <option value="ca">Català</option>
              <option value="es">Castellà</option>
            </select>
            <p className="mt-1 text-xs text-ink-400">
              La fonètica/fonologia treballada depèn de l&apos;idioma: crea
              versions separades si vols oferir el mateix exercici en
              català i castellà.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Crear exercici
          </Button>
        </form>
      </Card>
    </div>
  );
}
