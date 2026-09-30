"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Role = "therapist" | "parent" | "center_admin";

export function RegisterForm({
  dict,
  locale,
  initialRole = "therapist",
}: {
  dict: Dictionary;
  locale: Locale;
  initialRole?: Role;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [centerName, setCenterName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!consent) {
      setError(dict.auth.register.consentRequired);
      return;
    }

    setLoading(true);
    setError(null);

    // El trigger de la base de dades (handle_new_user) llegeix aquests
    // metadades per decidir si crea un centre nou (center_admin), s'uneix
    // a un d'existent via join_code (therapist), o no en necessita cap
    // (parent). Veure supabase/migrations/0013_center_signup_trigger.sql.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          locale,
          center_name: role === "center_admin" ? centerName : undefined,
          join_code: role === "therapist" ? joinCode.trim() : undefined,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/login?registered=1");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex justify-end">
          <LocaleSwitcher current={locale} />
        </div>

        <h1 className="mb-1 text-xl font-semibold text-ink-900">
          {dict.auth.register.title}
        </h1>
        <p className="mb-6 text-sm text-ink-400">
          {dict.auth.register.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.register.fullName}
            </label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.register.roleQuestion}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={role === "therapist" ? "primary" : "secondary"}
                onClick={() => setRole("therapist")}
                className="text-xs"
              >
                {dict.auth.register.roleTherapist}
              </Button>
              <Button
                type="button"
                variant={role === "parent" ? "primary" : "secondary"}
                onClick={() => setRole("parent")}
                className="text-xs"
              >
                {dict.auth.register.roleParent}
              </Button>
              <Button
                type="button"
                variant={role === "center_admin" ? "primary" : "secondary"}
                onClick={() => setRole("center_admin")}
                className="text-xs"
              >
                {dict.auth.register.roleCenterAdmin}
              </Button>
            </div>
          </div>

          {role === "center_admin" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                {dict.auth.register.centerName}
              </label>
              <Input
                required
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder={dict.auth.register.centerNamePlaceholder}
              />
            </div>
          )}

          {role === "therapist" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                {dict.auth.register.joinCodeLabel}
              </label>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder={dict.auth.register.joinCodePlaceholder}
              />
              <p className="mt-1 text-xs text-ink-400">
                {dict.auth.register.joinCodeHint}
              </p>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.register.email}
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              {dict.auth.register.password}
            </label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-ink-400">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>{dict.auth.register.consent}</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? dict.auth.register.submitting
              : dict.auth.register.submit}
          </Button>
        </form>
      </Card>
    </main>
  );
}
