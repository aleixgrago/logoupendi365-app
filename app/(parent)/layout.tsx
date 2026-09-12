import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("parent");
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-ink-900">{dict.common.appName}</span>
          <div className="flex items-center gap-4 text-sm">
            <LocaleSwitcher current={locale} />
            <span className="text-ink-400">{profile.full_name}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
