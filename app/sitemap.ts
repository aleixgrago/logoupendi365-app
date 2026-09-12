import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://logoupendi365.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/${locale}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ]);
}
