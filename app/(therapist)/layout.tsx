import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { LogoutButton } from "@/components/shared/logout-button";
import { IdleTimeout } from "@/components/shared/idle-timeout";

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
      <IdleTimeout />
      <header className="border-b-2 border-fun-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-ink-900">
            {dict.common.appName} <span aria-hidden="true">✨</span>
          </span>
          <nav className="flex items-center gap-6 text-sm text-ink-700">
            <Link href="/dashboard" className="hover:text-fun-600">
              {dict.nav.dashboard}
            </Link>
            <Link href="/patients" className="hover:text-fun-600">
              {dict.nav.patients}
            </Link>
            <Link href="/exercises-library" className="hover:text-fun-600">
              {dict.nav.exercises}
            </Link>
            <LocaleSwitcher current={locale} />
            <span className="text-ink-400">{profile.full_name}</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
