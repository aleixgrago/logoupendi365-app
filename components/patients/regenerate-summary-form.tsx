"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { RegenerateSummaryState } from "@/app/(therapist)/patients/[patientId]/clinical-sessions-actions";

export function RegenerateSummaryForm({
  action,
}: {
  action: (
    prevState: RegenerateSummaryState,
    formData: FormData
  ) => Promise<RegenerateSummaryState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-2 space-y-1">
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending
          ? "Generant resum… pot trigar una mica, no cal tornar a clicar"
          : "Generar resum ara"}
      </Button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
