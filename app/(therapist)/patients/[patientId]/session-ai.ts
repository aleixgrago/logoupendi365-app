import "server-only";

const PARTICIPATION_LABELS: Record<string, string> = {
  low: "baixa",
  medium: "mitjana",
  high: "alta",
};
const EVOLUTION_LABELS: Record<string, string> = {
  no_change: "sense canvis",
  mild_improvement: "lleu millora",
  significant_improvement: "millora significativa",
};

const SYSTEM_PROMPT = `Ets un assistent per a logopedes. A partir de dades
estructurades d'una sessió de teràpia del llenguatge (sense cap nom propi),
genera DOS resums.

1. family_summary: per als pares. To positiu, entenedor, professional,
MAI alarmista. Explica què s'ha treballat, què ha fet bé el nen/a, quin
progrés s'ha observat, i què poden reforçar a casa. Sense argot clínic.

2. clinical_summary: per al logopeda (mai visible als pares). Professional
i concís: objectius treballats, resposta del pacient, evolució observada,
aspectes a revisar.

Respon NOMÉS amb un objecte JSON vàlid: {"family_summary": "...",
"clinical_summary": "..."}. Mai incloguis noms propis, encara que
n'aparegui algun a les dades.`;

interface SessionAiInput {
  language: "ca" | "es";
  goalTitles: string[];
  exerciseTitles: string[];
  participation: string | null;
  evolutionRating: string | null;
  activities: string | null;
  nextSteps: string | null;
  notes: string | null;
}

function buildUserPrompt(input: SessionAiInput): string {
  const lines = [
    `Idioma de resposta: ${input.language === "es" ? "castellà" : "català"}.`,
    input.goalTitles.length > 0 &&
      `Objectius treballats: ${input.goalTitles.join(", ")}.`,
    input.exerciseTitles.length > 0 &&
      `Exercicis treballats: ${input.exerciseTitles.join(", ")}.`,
    input.participation &&
      `Participació del nen/a: ${PARTICIPATION_LABELS[input.participation] ?? input.participation}.`,
    input.evolutionRating &&
      `Evolució observada: ${EVOLUTION_LABELS[input.evolutionRating] ?? input.evolutionRating}.`,
    input.activities && `Activitats realitzades: ${input.activities}.`,
    input.nextSteps && `Recomanacions per casa: ${input.nextSteps}.`,
    input.notes && `Notes internes del logopeda: ${input.notes}.`,
  ].filter(Boolean);

  return lines.join("\n");
}

// "gemini-flash-latest" és un àlies estable (Google el va reassignant al
// model Flash vigent) — més segur a mitjà termini que fixar una versió
// datada concreta, que Google acaba retirant.
const GEMINI_MODEL = "gemini-flash-latest";

/**
 * Retorna null si no hi ha clau configurada o si la crida falla — mai
 * llança excepció. Qui la crida ha de deixar `family_summary_status` a
 * 'pending' si torna null, perquè es pugui reintentar més tard.
 */
export async function generateSessionSummaries(
  input: SessionAiInput
): Promise<{ family_summary: string; clinical_summary: string } | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: buildUserPrompt(input) }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (
      typeof parsed.family_summary !== "string" ||
      typeof parsed.clinical_summary !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
