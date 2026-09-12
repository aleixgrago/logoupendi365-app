"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function LoginForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(dict.auth.login.error);
      return;
    }

    router.replace("/app");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex justify-end">
          <LocaleSwitcher current={locale} />
        </div>

        <h1 className="mb-1 text-xl font-semibold text-ink-900">
          {dict.auth.login.title}
        </h1>
        <p className="mb-6 text-sm text-ink-400">{dict.auth.login.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.login.email}
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@exemple.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.login.password}
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? dict.auth.login.submitting : dict.auth.login.submit}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-400">
          {dict.auth.login.noAccount}{" "}
          <Link href="/register" className="text-brand-600 hover:underline">
            {dict.auth.login.registerLink}
          </Link>
        </p>
      </Card>
    </main>
  );
}
