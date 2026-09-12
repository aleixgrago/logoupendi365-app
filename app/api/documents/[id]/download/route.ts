import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticat" }, { status: 401 });
  }

  // No cal comprovar manualment la propietat: la policy de RLS de `documents`
  // ja garanteix que aquest select només retorna la fila si l'usuari és el
  // logopeda propietari o un tutor vinculat. Si no té accés, `data` és null.
  const { data: doc, error } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "No trobat" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("patient-documents")
    .createSignedUrl(doc.storage_path, 60);

  if (signError || !signed) {
    return NextResponse.json(
      { error: "No s'ha pogut generar la URL" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
