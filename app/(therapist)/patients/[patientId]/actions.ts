"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";

export async function linkGuardian(patientId: string, formData: FormData) {
  const { supabase } = await requireRole("therapist");

  const email = String(formData.get("email") ?? "").trim();
  if (!email) throw new Error("Cal indicar un email.");

  // Mateix workaround que a mark_assignment_completed (veure comentari allà).
  const { error } = await (supabase.rpc as any)("link_guardian_by_email", {
    p_patient_id: patientId,
    p_email: email,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/patients/${patientId}`);
}

export async function createGoal(patientId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "ca") as "ca" | "es";

  if (!title) {
    throw new Error("El títol de l'objectiu és obligatori.");
  }

  // La comprovació de propietat és responsabilitat de RLS: si patientId no
  // pertany a aquest terapeuta, l'insert simplement fallarà per la policy
  // de `goals`, que depèn de patients.therapist_id = auth.uid().
  const { error } = await supabase.from("goals").insert({
    patient_id: patientId,
    title,
    description,
    language,
  });

  if (error) throw new Error(error.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "goal_created",
    payload: { title },
    created_by: profile.id,
  });

  revalidatePath(`/patients/${patientId}`);
}

export async function assignExercise(patientId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const exercise_id = String(formData.get("exercise_id") ?? "");
  const goal_id = String(formData.get("goal_id") ?? "") || null;

  if (!exercise_id) {
    throw new Error("Cal seleccionar un exercici.");
  }

  const { error } = await supabase.from("exercise_assignments").insert({
    patient_id: patientId,
    exercise_id,
    goal_id,
  });

  if (error) throw new Error(error.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "exercise_assigned",
    payload: { exercise_id },
    created_by: profile.id,
  });

  revalidatePath(`/patients/${patientId}`);
}

export async function uploadDocument(patientId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Cal seleccionar un fitxer.");
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format no permès. Només PDF, JPG, PNG o DOCX.");
  }
  // Límit de mida raonable per evitar abús del pla gratuït d'Storage (1GB).
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("El fitxer supera els 10MB.");
  }

  const path = `${patientId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("patient-documents")
    .upload(path, file, { contentType: file.type });

  if (uploadError) throw new Error(uploadError.message);

  const { error: dbError } = await supabase.from("documents").insert({
    patient_id: patientId,
    uploaded_by: profile.id,
    storage_path: path,
    file_name: file.name,
    mime_type: file.type,
  });

  if (dbError) throw new Error(dbError.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "document_uploaded",
    payload: { file_name: file.name },
    created_by: profile.id,
  });

  revalidatePath(`/patients/${patientId}`);
}

