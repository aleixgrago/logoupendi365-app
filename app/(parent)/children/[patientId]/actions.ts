"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";

export async function completeAssignment(
  patientId: string,
  formData: FormData
) {
  const { supabase, profile } = await requireRole("parent");

  const assignmentId = String(formData.get("assignment_id") ?? "");
  if (!assignmentId) throw new Error("Falta l'identificador de l'exercici.");

  // Feedback ràpid (pas 5 de la Fase 1): tots opcionals, es completa
  // igualment encara que el pare no n'empleni cap.
  const easeRaw = formData.get("ease_rating");
  const motivationRaw = formData.get("motivation_rating");
  const ease_rating = easeRaw ? Number(easeRaw) : null;
  const motivation_rating = motivationRaw ? Number(motivationRaw) : null;
  const needed_help = formData.get("needed_help") === "yes";
  const outcome = String(formData.get("outcome") ?? "") || null;
  const feedback_comment =
    String(formData.get("feedback_comment") ?? "").trim().slice(0, 200) ||
    null;

  // NOTA: cast a `any` sobre `.rpc` (veure explicació a lib/supabase —
  // problema d'inferència de tipus amb el Database escrit a mà).
  const { error } = await (supabase.rpc as any)("mark_assignment_completed", {
    assignment_id: assignmentId,
    p_ease_rating: ease_rating,
    p_motivation_rating: motivation_rating,
    p_needed_help: needed_help,
    p_outcome: outcome,
    p_feedback_comment: feedback_comment,
  });

  if (error) throw new Error(error.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "exercise_completed_by_parent",
    payload: { assignment_id: assignmentId },
    created_by: profile.id,
  });

  revalidatePath(`/children/${patientId}`);
}

export async function undoAssignment(patientId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("parent");

  const assignmentId = String(formData.get("assignment_id") ?? "");
  if (!assignmentId) throw new Error("Falta l'identificador de l'exercici.");

  const { error } = await (supabase.rpc as any)(
    "undo_assignment_completion",
    { assignment_id: assignmentId }
  );

  if (error) throw new Error(error.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "exercise_marked_pending_by_parent",
    payload: { assignment_id: assignmentId },
    created_by: profile.id,
  });

  revalidatePath(`/children/${patientId}`);
}
