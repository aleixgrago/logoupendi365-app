import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-600">
        {dict.marketing.hero.eyebrow}
      </p>
      <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-ink-900 sm:text-5xl">
        {dict.marketing.hero.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-700">
        {dict.marketing.hero.subtitle}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/register?lang=${locale}&role=therapist`}
          className="rounded-xl bg-brand-500 px-5 py-3 text-center font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-600"
        >
          {dict.marketing.hero.ctaTherapist}
        </Link>
        <Link
          href={`/register?lang=${locale}&role=parent`}
          className="rounded-xl border border-ink-100 bg-white px-5 py-3 text-center font-medium text-ink-700 hover:bg-ink-50"
        >
          {dict.marketing.hero.ctaParent}
        </Link>
      </div>
    </section>
  );
}
