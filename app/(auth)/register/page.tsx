import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; role?: string }>;
}) {
  const { lang, role } = await searchParams;
  const cookieLocale = await getLocale();
  const locale = lang && isValidLocale(lang) ? lang : cookieLocale;
  const dict = getDictionary(locale);
  const initialRole = role === "parent" ? "parent" : "therapist";

  return <RegisterForm dict={dict} locale={locale} initialRole={initialRole} />;
}
