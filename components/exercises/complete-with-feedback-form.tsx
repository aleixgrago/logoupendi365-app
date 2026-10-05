"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CompleteWithFeedbackForm({
  assignmentId,
  action,
}: {
  assignmentId: string;
  action: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-coral-500 hover:bg-coral-600"
      >
        🎉 Ja ho hem fet!
      </Button>
    );
  }

  return (
    <form action={action} className="mt-2 space-y-3 rounded-xl bg-white/60 p-3">
      <input type="hidden" name="assignment_id" value={assignmentId} />

      <div>
        <p className="mb-1 text-xs font-medium text-ink-700">
          Quant de fàcil ha estat? (1 molt difícil — 5 molt fàcil)
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex-1">
              <input
                type="radio"
                name="ease_rating"
                value={n}
                className="peer sr-only"
                defaultChecked={n === 3}
              />
              <span className="block cursor-pointer rounded-lg border border-ink-100 py-1.5 text-center text-sm peer-checked:border-fun-500 peer-checked:bg-fun-100">
                {n}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-ink-700">
          Com de motivat estava el nen/a? (1 gens — 5 molt)
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex-1">
              <input
                type="radio"
                name="motivation_rating"
                value={n}
                className="peer sr-only"
                defaultChecked={n === 3}
              />
              <span className="block cursor-pointer rounded-lg border border-ink-100 py-1.5 text-center text-sm peer-checked:border-fun-500 peer-checked:bg-fun-100">
                {n}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-700">
          Ha necessitat ajuda?
        </p>
        <div className="flex gap-2 text-xs">
          <label className="flex items-center gap-1">
            <input type="radio" name="needed_help" value="yes" /> Sí
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="needed_help" value="no" defaultChecked /> No
          </label>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-ink-700">
          Respecte a l&apos;última vegada
        </p>
        <div className="flex gap-2">
          {[
            { value: "worse", label: "Pitjor" },
            { value: "same", label: "Igual" },
            { value: "better", label: "Millor" },
          ].map((o) => (
            <label key={o.value} className="flex-1">
              <input
                type="radio"
                name="outcome"
                value={o.value}
                className="peer sr-only"
              />
              <span className="block cursor-pointer rounded-lg border border-ink-100 py-1.5 text-center text-xs peer-checked:border-fun-500 peer-checked:bg-fun-100">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <input
        type="text"
        name="feedback_comment"
        maxLength={200}
        placeholder="Comentari curt (opcional)"
        className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
      />

      <Button type="submit" className="w-full bg-coral-500 hover:bg-coral-600">
        Desar
      </Button>
    </form>
  );
}
