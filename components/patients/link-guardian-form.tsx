"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LinkGuardianState } from "@/app/(therapist)/patients/[patientId]/actions";

export function LinkGuardianForm({
  action,
}: {
  action: (
    prevState: LinkGuardianState,
    formData: FormData
  ) => Promise<LinkGuardianState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="email del pare/tutor (ja registrat)"
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Vinculant..." : "Vincular"}
        </Button>
      </div>
      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
