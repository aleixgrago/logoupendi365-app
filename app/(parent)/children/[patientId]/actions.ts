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

  // Es crida a la funció SECURITY DEFINER definida a schema.sql. La pròpia
  // funció comprova que qui truca (auth.uid()) sigui realment un tutor
  // vinculat a aquest pacient abans d'actualitzar res — el pare mai té
  // permís UPDATE directe sobre la taula.
  const { error } = await supabase.rpc("mark_assignment_completed", {
    assignment_id: assignmentId,
  });

  if (error) throw new Error(error.message);

  // Registrem l'esdeveniment a l'historial perquè el logopeda el vegi al tab
  // "Historial" sense haver de mirar cada assignació una per una.
  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "exercise_completed_by_parent",
    payload: { assignment_id: assignmentId },
    created_by: profile.id,
  });

  revalidatePath(`/children/${patientId}`);
}
