"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step {
  instruction: string;
  tip: string;
}

export function StepsEditor({
  initialSteps = [{ instruction: "", tip: "" }],
}: {
  initialSteps?: Step[];
}) {
  const [steps, setSteps] = useState<Step[]>(
    initialSteps.length > 0 ? initialSteps : [{ instruction: "", tip: "" }]
  );

  function updateStep(index: number, field: keyof Step, value: string) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addStep() {
    setSteps((prev) => [...prev, { instruction: "", tip: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink-700">
        Passos a seguir (el pare els veurà en ordre)
      </label>

      {steps.map((step, i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-ink-100 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-400">
              Pas {i + 1}
            </span>
            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar
              </button>
            )}
          </div>
          <Input
            name="step_instruction"
            value={step.instruction}
            onChange={(e) => updateStep(i, "instruction", e.target.value)}
            placeholder="Què ha de fer el pare/nen en aquest pas"
          />
          <Input
            name="step_tip"
            value={step.tip}
            onChange={(e) => updateStep(i, "tip", e.target.value)}
            placeholder="Exemple o com saber si ho fa bé (opcional)"
          />
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addStep}>
        + Afegir pas
      </Button>
    </div>
  );
}
