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

  // NOTA: es fa un cast a `any` sobre `.rpc` per evitar un problema
  // d'inferència de tipus entre el nostre Database escrit a mà i la versió
  // instal·lada d'@supabase/supabase-js (el tipatge de retorn de funcions
  // 'void' no es resol correctament amb aquesta combinació de versions).
  // Un cop hi hagi un projecte Supabase real i es generin els tipus amb
  // `npm run gen:types`, aquest cast ja no hauria de fer falta.
  const { error } = await (supabase.rpc as any)("mark_assignment_completed", {
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
