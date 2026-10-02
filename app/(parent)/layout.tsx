import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { LogoutButton } from "@/components/shared/logout-button";
import { IdleTimeout } from "@/components/shared/idle-timeout";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("parent");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-50 via-white to-white">
      <IdleTimeout />
      <header className="border-b-2 border-fun-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-ink-900">
            {dict.common.appName}{" "}
            <span aria-hidden="true">🧒</span>
          </span>
          <div className="flex items-center gap-4 text-sm">
            <LocaleSwitcher current={locale} />
            <span className="text-ink-400">{profile.full_name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
