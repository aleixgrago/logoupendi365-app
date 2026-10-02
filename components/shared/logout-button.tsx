"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ label = "Tancar sessió" }: { label?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    // No cal indicar cap ruta concreta de destí: l'arrel ("/") ja decideix
    // sola que, sense sessió, cal anar a la landing en l'idioma adequat.
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-ink-400 hover:text-ink-700 disabled:opacity-50"
    >
      {loading ? "Sortint..." : label}
    </button>
  );
}
