import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";

export default async function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("therapist");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-ink-900">
            {dict.common.appName}
          </span>
          <nav className="flex items-center gap-6 text-sm text-ink-700">
            <Link href="/dashboard" className="hover:text-brand-600">
              {dict.nav.dashboard}
            </Link>
            <Link href="/patients" className="hover:text-brand-600">
              {dict.nav.patients}
            </Link>
            <Link href="/exercises-library" className="hover:text-brand-600">
              {dict.nav.exercises}
            </Link>
            <LocaleSwitcher current={locale} />
            <span className="text-ink-400">{profile.full_name}</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
