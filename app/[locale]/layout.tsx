import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingLocaleSwitcher } from "@/components/marketing/locale-switcher";
import { SetHtmlLang } from "@/components/marketing/set-html-lang";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-white">
      <SetHtmlLang locale={locale} />

      <header className="border-b border-ink-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href={`/${locale}`} className="font-semibold text-ink-900">
            {dict.common.appName}
          </Link>
          <nav className="flex items-center gap-6 text-sm text-ink-700">
            <a href="#com-funciona" className="hidden hover:text-brand-600 sm:inline">
              {dict.marketing.nav.howItWorks}
            </a>
            <a href="#per-a-qui" className="hidden hover:text-brand-600 sm:inline">
              {dict.marketing.nav.forWhom}
            </a>
            <Link
              href={`/login?lang=${locale}`}
              className="hover:text-brand-600"
            >
              {dict.marketing.nav.login}
            </Link>
            <Link
              href={`/register?lang=${locale}`}
              className="rounded-xl bg-brand-500 px-3 py-1.5 font-medium text-white hover:bg-brand-600"
            >
              {dict.marketing.nav.cta}
            </Link>
            <MarketingLocaleSwitcher current={locale} />
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-ink-400">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <p className="font-semibold text-ink-900">{dict.common.appName}</p>
              <p className="mt-1 max-w-xs">{dict.marketing.footer.tagline}</p>
            </div>
            <div className="flex gap-6">
              <Link href={`/${locale}/privacy`} className="hover:text-ink-700">
                {dict.marketing.footer.privacy}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-ink-700">
                {dict.marketing.footer.terms}
              </Link>
              <a
                href="mailto:hola@logoupendi365.com"
                className="hover:text-ink-700"
              >
                {dict.marketing.footer.contact}
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs">
            © {new Date().getFullYear()} {dict.common.appName}.{" "}
            {dict.marketing.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
