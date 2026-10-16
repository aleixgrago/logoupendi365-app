"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";

/** Llegeix i normalitza els camps del formulari d'exercici (crear i editar). */
function parseExerciseForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const stepInstructions = formData.getAll("step_instruction").map(String);
  const stepTips = formData.getAll("step_tip").map(String);
  // Es descarten els passos amb instruction buida (files afegides i no emplenades).
  const steps = stepInstructions
    .map((instruction, i) => ({
      instruction: instruction.trim(),
      tip: (stepTips[i] ?? "").trim(),
    }))
    .filter((s) => s.instruction.length > 0);

  return {
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    estimated_minutes: formData.get("estimated_minutes")
      ? Number(formData.get("estimated_minutes"))
      : null,
    recommended_frequency:
      String(formData.get("recommended_frequency") ?? "").trim() || null,
    language: String(formData.get("language") ?? "ca") as "ca" | "es",
    difficulty: String(formData.get("difficulty") ?? "") || null,
    disorder_category_id:
      String(formData.get("disorder_category_id") ?? "") || null,
    min_age: formData.get("min_age") ? Number(formData.get("min_age")) : null,
    max_age: formData.get("max_age") ? Number(formData.get("max_age")) : null,
    materials: String(formData.get("materials") ?? "").trim() || null,
    steps: steps.length > 0 ? steps : null,
  };
}

export async function createExercise(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const values = parseExerciseForm(formData);

  if (!values.title) throw new Error("El títol és obligatori.");

  // Un exercici creat des de l'app sempre queda privat del logopeda que
  // el crea. Les plantilles compartides (therapist_id null) només es
  // creen via migració — no hi ha cap manera d'obtenir-ne una des de la UI.
  const { error } = await supabase
    .from("exercises")
    .insert({ therapist_id: profile.id, ...values });

  if (error) throw new Error(error.message);

  redirect("/exercises-library");
}

export async function updateExercise(exerciseId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const values = parseExerciseForm(formData);

  if (!values.title) throw new Error("El títol és obligatori.");

  // El filtre per therapist_id impedeix editar plantilles compartides
  // (therapist_id null) o exercicis d'un altre logopeda.
  const { error } = await supabase
    .from("exercises")
    .update(values)
    .eq("id", exerciseId)
    .eq("therapist_id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/exercises-library");
  redirect("/exercises-library");
}

export type DeleteExerciseState = { error: string | null };

export async function deleteExercise(
  _prevState: DeleteExerciseState,
  formData: FormData
): Promise<DeleteExerciseState> {
  const { supabase, profile } = await requireRole("therapist");

  const exerciseId = String(formData.get("exercise_id") ?? "");
  if (!exerciseId) return { error: "Falta l'identificador de l'exercici." };

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId)
    .eq("therapist_id", profile.id);

  if (error) {
    // 23503 = foreign_key_violation: exercise_assignments.exercise_id és
    // "on delete restrict" (0001) — un exercici ja assignat no es pot
    // esborrar sense perdre l'historial del pacient.
    if (error.code === "23503") {
      return {
        error:
          "Aquest exercici ja està assignat a algun pacient i no es pot esborrar.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/exercises-library");
  return { error: null };
}
