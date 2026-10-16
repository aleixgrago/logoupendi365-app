"use client";

import { useActionState } from "react";
import type { DeleteExerciseState } from "@/app/(therapist)/exercises-library/actions";

export function DeleteExerciseForm({
  exerciseId,
  action,
}: {
  exerciseId: string;
  action: (
    prevState: DeleteExerciseState,
    formData: FormData
  ) => Promise<DeleteExerciseState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Segur que vols esborrar aquest exercici?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="exercise_id" value={exerciseId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? "Esborrant..." : "Esborrar"}
      </button>
      {state.error && (
        <p className="mt-1 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
