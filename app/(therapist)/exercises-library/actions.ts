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

  if (!title) {
    throw new Error("El títol és obligatori.");
  }

  const { error } = await supabase.from("exercises").insert({
    therapist_id: profile.id,
    title,
    description,
    estimated_minutes,
    recommended_frequency,
    language,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/exercises-library");
}
