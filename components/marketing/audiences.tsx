import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Audiences({ dict }: { dict: Dictionary }) {
  const { audiences } = dict.marketing;

  return (
    <section id="per-a-qui" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-center text-2xl font-semibold text-ink-900">
        {audiences.title}
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 p-6">
          <h3 className="mb-4 font-medium text-ink-900">
            {audiences.therapistTitle}
          </h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {audiences.therapistItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-progress-600">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-100 p-6">
          <h3 className="mb-4 font-medium text-ink-900">
            {audiences.parentTitle}
          </h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {audiences.parentItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-progress-600">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
