"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidLocale } from "@/lib/i18n/config";
import { LOCALE_COOKIE } from "@/lib/i18n/get-locale";

export async function setLocale(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");

  if (!isValidLocale(locale)) {
    throw new Error("Idioma no suportat.");
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 any
    path: "/",
  });

  // Si l'usuari ha iniciat sessió, guardem també la preferència al perfil.
  // No és la font de veritat activa (la cookie ho és, veure get-locale.ts),
  // però queda preparat per a una futura sincronització entre dispositius.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").update({ locale }).eq("id", user.id);
  }

  revalidatePath("/", "layout");
}
