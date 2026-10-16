import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { StepsEditor } from "@/components/exercises/steps-editor";

interface ExerciseFormValues {
  title?: string;
  description?: string | null;
  estimated_minutes?: number | null;
  recommended_frequency?: string | null;
  language?: "ca" | "es";
  difficulty?: string | null;
  disorder_category_id?: string | null;
  min_age?: number | null;
  max_age?: number | null;
  materials?: string | null;
  steps?: { instruction: string; tip: string }[] | null;
}

/**
 * Camps del formulari d'exercici, compartits per "Nou exercici" i
 * "Editar exercici" (abans estaven duplicats). `initial` omple els valors
 * en mode edició.
 */
export function ExerciseForm({
  action,
  categories,
  initial = {},
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: { id: string; name_ca: string }[];
  initial?: ExerciseFormValues;
  submitLabel: string;
}) {
  const label = "mb-1 block text-sm font-medium text-ink-700";
  const select =
    "w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm";

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={label}>Títol</label>
        <Input
          name="title"
          required
          defaultValue={initial.title ?? ""}
          placeholder="p. ex. Pronunciar la R"
        />
      </div>

      <div>
        <label className={label}>Descripció</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial.description ?? ""}
          className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div>
        <label className={label}>Categoria / trastorn treballat</label>
        <select
          name="disorder_category_id"
          defaultValue={initial.disorder_category_id ?? ""}
          className={select}
        >
          <option value="">Sense categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_ca}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Durada estimada (min)</label>
          <Input
            type="number"
            name="estimated_minutes"
            min={1}
            defaultValue={initial.estimated_minutes ?? ""}
          />
        </div>
        <div>
          <label className={label}>Freqüència recomanada</label>
          <Input
            name="recommended_frequency"
            defaultValue={initial.recommended_frequency ?? ""}
            placeholder="3 cops/setmana"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Edat mínima</label>
          <Input
            type="number"
            name="min_age"
            min={0}
            max={18}
            defaultValue={initial.min_age ?? ""}
          />
        </div>
        <div>
          <label className={label}>Edat màxima</label>
          <Input
            type="number"
            name="max_age"
            min={0}
            max={18}
            defaultValue={initial.max_age ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Dificultat</label>
          <select
            name="difficulty"
            defaultValue={initial.difficulty ?? ""}
            className={select}
          >
            <option value="">Sense especificar</option>
            <option value="easy">Fàcil</option>
            <option value="medium">Mitjana</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
        <div>
          <label className={label}>Idioma de l&apos;exercici</label>
          <select
            name="language"
            defaultValue={initial.language ?? "ca"}
            className={select}
          >
            <option value="ca">Català</option>
            <option value="es">Castellà</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Material necessari</label>
        <Input
          name="materials"
          defaultValue={initial.materials ?? ""}
          placeholder="p. ex. Un mirall, targetes de paraules"
        />
      </div>

      <StepsEditor
        initialSteps={
          initial.steps && initial.steps.length > 0
            ? initial.steps
            : [{ instruction: "", tip: "" }]
        }
      />

      <p className="text-xs text-ink-400">
        Els passos són el que veurà el pare/tutor per fer l&apos;exercici sol a
        casa, sense el logopeda present — com més concret i clar, millor. El
        camp d&apos;exemple de cada pas és opcional, però molt recomanable.
      </p>

      <SubmitButton className="w-full" pendingLabel="Desant...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
