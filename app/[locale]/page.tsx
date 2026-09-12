import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Audiences } from "@/components/marketing/audiences";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { PricingStub } from "@/components/marketing/pricing-stub";

// Genera /ca i /es de forma estàtica en build (millor rendiment i millor
// per a SEO que resoldre-ho sempre en runtime).
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://logoupendi365.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return {
    title: dict.marketing.metaTitle,
    description: dict.marketing.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
    openGraph: {
      title: dict.marketing.metaTitle,
      description: dict.marketing.metaDescription,
      url: `${SITE_URL}/${locale}`,
      siteName: dict.common.appName,
      locale: locale === "ca" ? "ca_ES" : "es_ES",
      type: "website",
      // TODO: afegir images: [`${SITE_URL}/og-image.png`] quan hi hagi una
      // imatge real de 1200x630 — no se n'ha fabricat cap de falsa.
    },
    twitter: {
      card: "summary_large_image",
      title: dict.marketing.metaTitle,
      description: dict.marketing.metaDescription,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: dict.common.appName,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description: dict.marketing.metaDescription,
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
  };

  return (
    <>
      {/* Dades estructurades: ajuden Google a entendre de què tracta la
          pàgina més enllà del text visible (rich results potencials). */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero dict={dict} locale={locale} />
      <HowItWorks dict={dict} />
      <Audiences dict={dict} />
      <DashboardPreview dict={dict} />
      <PricingStub dict={dict} locale={locale} />
    </>
  );
}
