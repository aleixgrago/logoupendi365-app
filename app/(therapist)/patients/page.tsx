import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { supabase, profile } = await requireRole("therapist");
  const { q, status } = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  let query = supabase
    .from("patients")
    .select("id, first_name, last_name, birth_date, status")
    .eq("therapist_id", profile.id)
    .order("last_name", { ascending: true });

  if (status === "active" || status === "inactive") {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
  }

  const { data: patients, error } = await query;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink-900">{dict.patients.title}</h1>
        <Link href="/patients/new">
          <Button>{dict.patients.newPatient}</Button>
        </Link>
      </div>

      <form className="mb-4 flex gap-2" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder={dict.patients.searchPlaceholder}
          className="w-full max-w-xs rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm"
        >
          <option value="">{dict.patients.filterAll}</option>
          <option value="active">{dict.patients.filterActive}</option>
          <option value="inactive">{dict.patients.filterInactive}</option>
        </select>
        <Button type="submit" variant="secondary">
          {dict.patients.filterSubmit}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-600">
          Error carregant pacients: {error.message}
        </p>
      )}

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-ink-400">
              <th className="px-4 py-3 font-medium">{dict.patients.colName}</th>
              <th className="px-4 py-3 font-medium">{dict.patients.colBirthDate}</th>
              <th className="px-4 py-3 font-medium">{dict.patients.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {(patients ?? []).map((p) => (
              <tr
                key={p.id}
                className="border-b border-ink-100 last:border-0 hover:bg-ink-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/patients/${p.id}`}
                    className="font-medium text-ink-900 hover:text-brand-600"
                  >
                    {p.first_name} {p.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{p.birth_date}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === "active"
                        ? "rounded-full bg-progress-100 px-2 py-0.5 text-xs text-progress-600"
                        : "rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-400"
                    }
                  >
                    {p.status === "active" ? dict.patients.statusActive : dict.patients.statusInactive}
                  </span>
                </td>
              </tr>
            ))}
            {(patients ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-400">
                  {dict.patients.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
