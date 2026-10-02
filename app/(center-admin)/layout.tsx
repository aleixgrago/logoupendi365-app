import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { LogoutButton } from "@/components/shared/logout-button";
import { IdleTimeout } from "@/components/shared/idle-timeout";

export default async function CenterAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("center_admin");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen">
      <IdleTimeout />
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-ink-900">
            {dict.common.appName}
          </span>
          <div className="flex items-center gap-4 text-sm text-ink-700">
            <span className="font-medium">{dict.nav.center}</span>
            <LocaleSwitcher current={locale} />
            <span className="text-ink-400">{profile.full_name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
