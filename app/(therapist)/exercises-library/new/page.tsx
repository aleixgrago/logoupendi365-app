import { requireRole } from "@/lib/auth/guards";
import { createExercise } from "../actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepsEditor } from "@/components/exercises/steps-editor";

export default async function NewExercisePage() {
  const { supabase } = await requireRole("therapist");

  const { data: categories } = await supabase
    .from("disorder_categories")
    .select("id, name_ca")
    .order("name_ca", { ascending: true });

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

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Categoria / trastorn treballat
            </label>
            <select
              name="disorder_category_id"
              defaultValue=""
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            >
              <option value="">Sense categoria</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_ca}
                </option>
              ))}
            </select>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Edat mínima
              </label>
              <Input type="number" name="min_age" min={0} max={18} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                Edat màxima
              </label>
              <Input type="number" name="max_age" min={0} max={18} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Dificultat
            </label>
            <select
              name="difficulty"
              defaultValue=""
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
            >
              <option value="">Sense especificar</option>
              <option value="easy">Fàcil</option>
              <option value="medium">Mitjana</option>
              <option value="hard">Difícil</option>
            </select>
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
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Material necessari
            </label>
            <Input
              name="materials"
              placeholder="p. ex. Un mirall, targetes de paraules"
            />
          </div>

          <StepsEditor />

          <p className="text-xs text-ink-400">
            Els passos són el que veurà el pare/tutor per fer l&apos;exercici
            sol a casa, sense el logopeda present — com més concret i clar,
            millor. El camp &quot;exemple / com saber si ho fa bé&quot; de
            cada pas és opcional, però molt recomanable.
          </p>

          <Button type="submit" className="w-full">
            Crear exercici
          </Button>
        </form>
      </Card>
    </div>
  );
}
