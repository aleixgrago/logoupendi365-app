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
  const referral_reason =
    String(formData.get("referral_reason") ?? "").trim() || null;
  const relevant_background =
    String(formData.get("relevant_background") ?? "").trim() || null;

  if (!first_name || !last_name || !birth_date) {
    throw new Error("Falten camps obligatoris.");
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .insert({
      therapist_id: profile.id,
      // Tot pacient nou queda vinculat al centre del terapeuta que el
      // crea — és el que fa que l'admin del centre el vegi al seu
      // panell (migració 0012_centers.sql).
      center_id: profile.center_id,
      first_name,
      last_name,
      birth_date,
      diagnosis,
      preferred_language,
      referral_reason,
      relevant_background,
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

export async function updatePatient(patientId: string, formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");

  const first_name = String(formData.get("first_name") ?? "").trim();
  const last_name = String(formData.get("last_name") ?? "").trim();
  const birth_date = String(formData.get("birth_date") ?? "");
  const diagnosis = String(formData.get("diagnosis") ?? "").trim() || null;
  const preferred_language =
    (String(formData.get("preferred_language") ?? "") as "ca" | "es" | "") ||
    null;
  const referral_reason =
    String(formData.get("referral_reason") ?? "").trim() || null;
  const relevant_background =
    String(formData.get("relevant_background") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "active");

  if (!first_name || !last_name || !birth_date) {
    throw new Error("Falten camps obligatoris.");
  }
  if (status !== "active" && status !== "inactive") {
    throw new Error("Estat no vàlid.");
  }

  // RLS ja limita l'update als pacients d'aquest terapeuta; el filtre
  // explícit només fa el codi més clar.
  const { error } = await supabase
    .from("patients")
    .update({
      first_name,
      last_name,
      birth_date,
      diagnosis,
      preferred_language,
      referral_reason,
      relevant_background,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", patientId)
    .eq("therapist_id", profile.id);

  if (error) throw new Error(error.message);

  await supabase.from("history_events").insert({
    patient_id: patientId,
    event_type: "patient_updated",
    created_by: profile.id,
  });

  redirect(`/patients/${patientId}`);
}
