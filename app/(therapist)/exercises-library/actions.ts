"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";

export async function createExercise(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const estimated_minutes = formData.get("estimated_minutes")
    ? Number(formData.get("estimated_minutes"))
    : null;
  const recommended_frequency =
    String(formData.get("recommended_frequency") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "ca") as "ca" | "es";
  const difficulty = String(formData.get("difficulty") ?? "") || null;
  const disorder_category_id =
    String(formData.get("disorder_category_id") ?? "") || null;
  const min_age = formData.get("min_age") ? Number(formData.get("min_age")) : null;
  const max_age = formData.get("max_age") ? Number(formData.get("max_age")) : null;
  const materials = String(formData.get("materials") ?? "").trim() || null;

  // L'editor de passos envia dues llistes paral·leles (una entrada per
  // pas): step_instruction[] i step_tip[]. Es descarten els passos amb
  // instruction buida (files afegides i no emplenades).
  const stepInstructions = formData.getAll("step_instruction").map(String);
  const stepTips = formData.getAll("step_tip").map(String);
  const steps = stepInstructions
    .map((instruction, i) => ({
      instruction: instruction.trim(),
      tip: (stepTips[i] ?? "").trim(),
    }))
    .filter((s) => s.instruction.length > 0);

  if (!title) {
    throw new Error("El títol és obligatori.");
  }

  // Un exercici creat des de l'app sempre queda com a privat del logopeda
  // que el crea (therapist_id = profile.id). Els exercicis "plantilla"
  // compartits (therapist_id null) només es creen via migració/seed —
  // no hi ha cap manera d'obtenir-ne un des de la UI, a propòsit.
  const { error } = await supabase.from("exercises").insert({
    therapist_id: profile.id,
    title,
    description,
    estimated_minutes,
    recommended_frequency,
    language,
    difficulty,
    disorder_category_id,
    min_age,
    max_age,
    materials,
    steps: steps.length > 0 ? steps : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/exercises-library");
}
