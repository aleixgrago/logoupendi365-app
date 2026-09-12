import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Recupera l'usuari autenticat i el seu perfil (amb rol). Si no hi ha sessió,
 * redirigeix a /login. Fes-ho servir a l'inici de cada layout protegit.
 */
export async function requireUser(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  profile: Profile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Perfil no trobat: pot passar si el trigger de creació de perfil ha
    // fallat. Millor tallar aquí que deixar un usuari "fantasma" navegant.
    redirect("/login");
  }

  return { supabase, profile: profile as Profile };
}

/**
 * Igual que requireUser, però a més verifica el rol esperat. Fes-ho servir
 * al layout.tsx de (therapist) i (parent) respectivament. Aquesta comprovació
 * és una xarxa de seguretat addicional: la garantia real segueix sent RLS a
 * la base de dades, no aquesta funció.
 */
export async function requireRole(role: Profile["role"]) {
  const { supabase, profile } = await requireUser();

  if (profile.role !== role) {
    redirect(profile.role === "therapist" ? "/dashboard" : "/children");
  }

  return { supabase, profile };
}
