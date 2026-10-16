import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { updateExercise } from "../../actions";
import { Card } from "@/components/ui/card";
import { ExerciseForm } from "@/components/exercises/exercise-form";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { exerciseId } = await params;

  // Només els exercicis propis: les plantilles compartides (therapist_id
  // null) no coincideixen amb aquest filtre i donen 404, a propòsit.
  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", exerciseId)
    .eq("therapist_id", profile.id)
    .single();

  if (!exercise) notFound();

  const { data: categories } = await supabase
    .from("disorder_categories")
    .select("id, name_ca")
    .order("name_ca", { ascending: true });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-1 text-sm text-ink-400">
        <Link href="/exercises-library" className="hover:text-fun-600">
          ← Biblioteca d&apos;exercicis
        </Link>
      </div>
      <h1 className="mb-6 text-lg font-semibold text-ink-900">
        Editar exercici
      </h1>
      <Card>
        <ExerciseForm
          action={updateExercise.bind(null, exerciseId)}
          categories={categories ?? []}
          initial={exercise}
          submitLabel="Desar canvis"
        />
      </Card>
    </div>
  );
}
