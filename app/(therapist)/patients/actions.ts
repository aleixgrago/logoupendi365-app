"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";

export async function createPatient(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const first_name = String(formData.get("first_name") ?? "").trim();
  const last_name = String(formData.get("last_name") ?? "").trim();
  const birth_date = String(formData.get("birth_date") ?? "");
  const diagnosis = String(formData.get("diagnosis") ?? "").trim() || null;
  const preferred_language =
    (String(formData.get("preferred_language") ?? "") as "ca" | "es" | "") ||
    null;

  if (!first_name || !last_name || !birth_date) {
    throw new Error("Falten camps obligatoris.");
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .insert({
      therapist_id: profile.id,
      first_name,
      last_name,
      birth_date,
      diagnosis,
      preferred_language,
    })
    .select("id")
    .single();

  if (error || !patient) {
    throw new Error(error?.message ?? "No s'ha pogut crear el pacient.");
  }

  // Registre a l'historial per traçabilitat/auditoria (Art. 32 RGPD).
  await supabase.from("history_events").insert({
    patient_id: patient.id,
    event_type: "patient_created",
    created_by: profile.id,
  });

  redirect(`/patients/${patient.id}`);
}
