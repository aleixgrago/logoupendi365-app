"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";

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
  // Objectius treballats: múltiples checkboxes amb name="goal_ids".
  const goal_ids = formData.getAll("goal_ids").map(String);

  if (!session_date) {
    throw new Error("Cal indicar la data de la sessió.");
  }

  // RLS de `clinical_sessions` (0006) ja limita l'insert al terapeuta
  // propietari del pacient — no cal cap comprovació extra aquí.
  const { error } = await supabase.from("clinical_sessions").insert({
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
  });

  if (error) throw new Error(error.message);

  // Nota: NO es registra a `history_events` (log automàtic d'accions del
  // sistema) perquè una sessió clínica és contingut redactat pel
  // professional, no un esdeveniment del sistema — ja viu a la seva
  // pròpia taula amb el seu propi RLS (decisió presa a 0006).

  revalidatePath(`/patients/${patientId}`);
}
