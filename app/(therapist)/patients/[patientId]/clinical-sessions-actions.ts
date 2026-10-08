"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { generateSessionSummaries } from "./session-ai";

export async function createClinicalSession(
  patientId: string,
  formData: FormData
) {
  const { supabase, profile } = await requireRole("therapist");

  const session_date = String(formData.get("session_date") ?? "");
  const duration_minutes = formData.get("duration_minutes")
    ? Number(formData.get("duration_minutes"))
    : null;
  const activities = String(formData.get("activities") ?? "").trim() || null;
  const evolution = String(formData.get("evolution") ?? "").trim() || null;
  const next_steps = String(formData.get("next_steps") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "ca") as "ca" | "es";
  const goal_ids = formData.getAll("goal_ids").map(String);
  const exercise_ids = formData.getAll("exercise_ids").map(String);
  const participation = String(formData.get("participation") ?? "") || null;
  const evolution_rating =
    String(formData.get("evolution_rating") ?? "") || null;

  if (!session_date) {
    throw new Error("Cal indicar la data de la sessió.");
  }

  // RLS de `clinical_sessions` (0006) ja limita l'insert al terapeuta
  // propietari del pacient — no cal cap comprovació extra aquí.
  // family_summary_status queda al seu default 'pending' (0021): la
  // generació IA és el pas 4, encara no crida res aquí.
  const { data: session, error } = await supabase
    .from("clinical_sessions")
    .insert({
      patient_id: patientId,
      therapist_id: profile.id,
      session_date,
      duration_minutes,
      activities,
      evolution,
      next_steps,
      notes,
      language,
      goal_ids: goal_ids.length > 0 ? goal_ids : null,
      exercise_ids: exercise_ids.length > 0 ? exercise_ids : null,
      participation,
      evolution_rating,
    })
    .select("id")
    .single();

  if (error || !session) throw new Error(error?.message ?? "Error desant la sessió.");

  // Nota: NO es registra a `history_events` (log automàtic d'accions del
  // sistema) perquè una sessió clínica és contingut redactat pel
  // professional, no un esdeveniment del sistema — ja viu a la seva
  // pròpia taula amb el seu propi RLS (decisió presa a 0006).

  // La sessió ja està desada; la IA és un pas no bloquejant. Si falla o
  // triga, la sessió queda igualment guardada amb status 'pending'
  // (reintentable des de la UI amb regenerateSessionSummaries).
  const [goalTitles, exerciseTitles] = await Promise.all([
    goal_ids.length > 0
      ? supabase.from("goals").select("title").in("id", goal_ids)
      : Promise.resolve({ data: [] as { title: string }[] }),
    exercise_ids.length > 0
      ? supabase.from("exercises").select("title").in("id", exercise_ids)
      : Promise.resolve({ data: [] as { title: string }[] }),
  ]);

  const summaries = await generateSessionSummaries({
    language,
    goalTitles: (goalTitles.data ?? []).map((g) => g.title),
    exerciseTitles: (exerciseTitles.data ?? []).map((e) => e.title),
    participation,
    evolutionRating: evolution_rating,
    activities,
    nextSteps: next_steps,
    notes,
  });

  if (summaries) {
    await supabase
      .from("clinical_sessions")
      .update({
        family_summary: summaries.family_summary,
        clinical_summary: summaries.clinical_summary,
        family_summary_status: "draft",
      })
      .eq("id", session.id);
  }

  revalidatePath(`/patients/${patientId}`);
}

/**
 * Reintent manual quan la generació automàtica ha fallat (status es queda
 * 'pending'). Mateixa lògica que a createClinicalSession, aplicada a una
 * sessió ja existent.
 */
export async function regenerateSessionSummaries(
  patientId: string,
  sessionId: string
) {
  const { supabase } = await requireRole("therapist");

  const { data: session } = await supabase
    .from("clinical_sessions")
    .select(
      "language, goal_ids, exercise_ids, participation, evolution_rating, activities, next_steps, notes"
    )
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Sessió no trobada.");

  const goalIds: string[] = session.goal_ids ?? [];
  const exerciseIds: string[] = session.exercise_ids ?? [];

  const [goalTitles, exerciseTitles] = await Promise.all([
    goalIds.length > 0
      ? supabase.from("goals").select("title").in("id", goalIds)
      : Promise.resolve({ data: [] as { title: string }[] }),
    exerciseIds.length > 0
      ? supabase.from("exercises").select("title").in("id", exerciseIds)
      : Promise.resolve({ data: [] as { title: string }[] }),
  ]);

  const summaries = await generateSessionSummaries({
    language: session.language,
    goalTitles: (goalTitles.data ?? []).map((g) => g.title),
    exerciseTitles: (exerciseTitles.data ?? []).map((e) => e.title),
    participation: session.participation,
    evolutionRating: session.evolution_rating,
    activities: session.activities,
    nextSteps: session.next_steps,
    notes: session.notes,
  });

  if (!summaries) {
    throw new Error("No s'ha pogut generar el resum. Torna-ho a provar.");
  }

  const { error } = await supabase
    .from("clinical_sessions")
    .update({
      family_summary: summaries.family_summary,
      clinical_summary: summaries.clinical_summary,
      family_summary_status: "draft",
    })
    .eq("id", sessionId);

  if (error) throw new Error(error.message);

  revalidatePath(`/patients/${patientId}`);
}

/**
 * Aprova el resum familiar generat per IA (pas 4) perquè sigui visible al
 * pare via la vista `patient_session_summaries`. Només avança de 'draft'
 * a 'approved' — mai aprova un resum que encara no s'ha generat.
 */
export async function approveFamilySummary(
  patientId: string,
  sessionId: string
) {
  const { supabase } = await requireRole("therapist");

  const { error } = await supabase
    .from("clinical_sessions")
    .update({ family_summary_status: "approved" })
    .eq("id", sessionId)
    .eq("family_summary_status", "draft");

  if (error) throw new Error(error.message);

  revalidatePath(`/patients/${patientId}`);
}
