"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { localeNames, type Locale } from "@/lib/i18n/config";

interface ExerciseOption {
  id: string;
  title: string;
  language: "ca" | "es";
  disorder_category_id: string | null;
  disorder_categories: { name_ca: string } | { name_ca: string }[] | null;
}

function categoryName(ex: ExerciseOption): string {
  const cat = ex.disorder_categories;
  if (!cat) return "Sense categoria";
  return Array.isArray(cat) ? cat[0]?.name_ca ?? "Sense categoria" : cat.name_ca;
}

export function AssignExerciseForm({
  exercises,
  action,
}: {
  exercises: ExerciseOption[];
  action: (formData: FormData) => void;
}) {
  const [language, setLanguage] = useState<Locale | "">("");
  const [categoryId, setCategoryId] = useState("");

  // Les categories disponibles depenen de l'idioma triat (si n'hi ha un),
  // perquè no té sentit oferir una categoria sense cap exercici en aquell
  // idioma. Igual amb els exercicis: depenen d'idioma + categoria triats.
  const filteredByLanguage = useMemo(
    () => (language ? exercises.filter((ex) => ex.language === language) : exercises),
    [exercises, language]
  );

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const ex of filteredByLanguage) {
      const id = ex.disorder_category_id ?? "__none__";
      if (!map.has(id)) map.set(id, categoryName(ex));
    }
    return [...map.entries()];
  }, [filteredByLanguage]);

  const filteredExercises = useMemo(() => {
    if (!categoryId) return filteredByLanguage;
    return filteredByLanguage.filter(
      (ex) => (ex.disorder_category_id ?? "__none__") === categoryId
    );
  }, [filteredByLanguage, categoryId]);

  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value as Locale | "");
            setCategoryId(""); // canviar d'idioma reinicia la categoria triada
          }}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
        >
          <option value="">Tots els idiomes</option>
          <option value="ca">{localeNames.ca}</option>
          <option value="es">{localeNames.es}</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
        >
          <option value="">Totes les categories</option>
          {categories.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          name="exercise_id"
          required
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
        >
          {filteredExercises.length === 0 && <option value="">Cap exercici disponible</option>}
          {filteredExercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-ink-700">
          Dies de la setmana (opcional — deixa-ho buit per a flexible)
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <label
              key={d.value}
              className="flex items-center gap-1 rounded-lg border border-ink-100 px-2 py-1 text-xs text-ink-700"
            >
              <input type="checkbox" name="scheduled_days" value={d.value} />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={filteredExercises.length === 0}>
        Assignar
      </Button>
    </form>
  );
}

const DAYS = [
  { value: "mon", label: "Dl" },
  { value: "tue", label: "Dt" },
  { value: "wed", label: "Dc" },
  { value: "thu", label: "Dj" },
  { value: "fri", label: "Dv" },
  { value: "sat", label: "Ds" },
  { value: "sun", label: "Dg" },
];
