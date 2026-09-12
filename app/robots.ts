import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://logoupendi365.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ca", "/es"],
        // L'aplicació autenticada no ha d'indexar-se: no aporta res a SEO
        // i podria filtrar rutes internes a resultats de cerca.
        disallow: ["/app", "/dashboard", "/patients", "/children", "/exercises-library"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
