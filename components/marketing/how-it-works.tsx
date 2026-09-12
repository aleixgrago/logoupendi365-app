import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function HowItWorks({ dict }: { dict: Dictionary }) {
  return (
    <section id="com-funciona" className="bg-ink-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-10 text-center text-2xl font-semibold text-ink-900">
          {dict.marketing.howItWorks.title}
        </h2>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {dict.marketing.howItWorks.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-ink-100 bg-white p-5"
            >
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="font-medium text-ink-900">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-700">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
