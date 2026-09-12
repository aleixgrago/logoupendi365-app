import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";

/**
 * Punt d'entrada de l'aplicació autenticada. Abans vivia a l'arrel ("/"),
 * però ara l'arrel és la landing pública — un usuari ja autenticat que hi
 * navega és redirigit aquí (veure app/page.tsx).
 */
export default async function AppEntryPage() {
  const { profile } = await requireUser();
  redirect(profile.role === "therapist" ? "/dashboard" : "/children");
}
