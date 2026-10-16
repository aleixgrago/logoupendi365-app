import { requireRole } from "@/lib/auth/guards";
import { createExercise } from "../actions";
import { Card } from "@/components/ui/card";
import { ExerciseForm } from "@/components/exercises/exercise-form";

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
        <ExerciseForm
          action={createExercise}
          categories={categories ?? []}
          submitLabel="Crear exercici"
        />
      </Card>
    </div>
  );
}
