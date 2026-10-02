import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Cridat una vegada al dia per Vercel Cron (veure vercel.json). L'únic
 * objectiu és que Supabase vegi activitat real a la base de dades, perquè
 * el pla Free pausa els projectes als 7 dies sense cap consulta.
 *
 * Fa servir `disorder_categories` (taula de referència, llegible per
 * qualsevol — `using (true)` a la seva policy) perquè funcioni encara
 * que la crida no porti cap sessió d'usuari, que és el cas normal aquí.
 *
 * Protegit amb CRON_SECRET: Vercel afegeix automàticament la capçalera
 * `Authorization: Bearer <CRON_SECRET>` a les invocacions de cron quan
 * aquesta variable d'entorn existeix — així ningú més pot cridar aquesta
 * ruta des de fora.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET
    ? `Bearer ${process.env.CRON_SECRET}`
    : null;

  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("disorder_categories")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    rowsSeen: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}
