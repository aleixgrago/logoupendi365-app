import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * Mockup fet amb HTML/CSS, no una captura real de l'app (encara no tenim
 * un desplegament públic per fer-ne una, i no té sentit fabricar-ne una
 * de falsa). Reprodueix fidelment el dashboard real (mateixos KPIs i
 * paleta) perquè quan hi hagi una versió desplegada, substituir-ho per
 * una captura autèntica sigui un simple canvi d'aquest component.
 */
export function DashboardPreview({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-center text-2xl font-semibold text-ink-900">
        {dict.marketing.preview.title}
      </h2>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ink-100 shadow-lg shadow-ink-900/5">
        {/* barra de finestra */}
        <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
        </div>

        <div className="bg-white p-6">
          <p className="mb-4 text-sm font-medium text-ink-900">
            Hola, Marta
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-ink-100 p-3">
              <p className="text-xs text-ink-400">Pacients actius</p>
              <p className="mt-1 text-xl font-semibold text-ink-900">18</p>
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <p className="text-xs text-ink-400">Exercicis (7 dies)</p>
              <p className="mt-1 text-xl font-semibold text-ink-900">42</p>
            </div>
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
              <p className="text-xs text-ink-400">Sense activitat</p>
              <p className="mt-1 text-xl font-semibold text-ink-900">2</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">
                  Pronunciar la R
                </p>
                <p className="text-xs text-ink-400">Objectiu · Pol G.</p>
              </div>
              <div className="h-2 w-24 rounded-full bg-ink-100">
                <div className="h-2 w-3/4 rounded-full bg-progress-400" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">
                  Consciència fonològica
                </p>
                <p className="text-xs text-ink-400">Objectiu · Anna R.</p>
              </div>
              <div className="h-2 w-24 rounded-full bg-ink-100">
                <div className="h-2 w-2/5 rounded-full bg-progress-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-md text-center text-sm text-ink-400">
        {dict.marketing.preview.caption}
      </p>
    </section>
  );
}
