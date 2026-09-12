import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const cookieLocale = await getLocale();
  const locale = lang && isValidLocale(lang) ? lang : cookieLocale;
  const dict = getDictionary(locale);

  return <LoginForm dict={dict} locale={locale} />;
}
