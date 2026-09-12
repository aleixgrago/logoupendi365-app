import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function PricingStub({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="bg-ink-50 py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-ink-900">
          {dict.marketing.pricing.title}
        </h2>
        <p className="mb-6 text-ink-700">{dict.marketing.pricing.body}</p>
        <Link
          href={`/register?lang=${locale}&role=therapist`}
          className="inline-block rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600"
        >
          {dict.marketing.pricing.cta}
        </Link>
      </div>
    </section>
  );
}
