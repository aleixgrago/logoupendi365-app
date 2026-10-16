"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/**
 * Botó per a formularis amb Server Action: es desactiva mentre l'acció
 * s'executa (useFormStatus) i mostra `pendingLabel`. Evita dobles clics
 * — crític a les accions lentes (crida a Gemini), on un segon clic
 * llançava una segona petició concurrent o duplicava la sessió.
 */
export function SubmitButton({
  children,
  pendingLabel = "Un moment...",
  ...props
}: ComponentPropsWithoutRef<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
