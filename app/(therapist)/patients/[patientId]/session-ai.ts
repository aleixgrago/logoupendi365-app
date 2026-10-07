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

/**
 * Retorna null si no hi ha clau configurada o si la crida falla — mai
 * llança excepció. Qui la crida ha de deixar `family_summary_status` a
 * 'pending' si torna null, perquè es pugui reintentar més tard.
 */
export async function generateSessionSummaries(
  input: SessionAiInput
): Promise<{ family_summary: string; clinical_summary: string } | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(input) },
        ],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
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
