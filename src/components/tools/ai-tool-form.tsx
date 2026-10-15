"use client";

import { useState, type FormEvent } from "react";
import type { ToolField, ToolResultGroup } from "@/lib/data/tools";
import { inputClass, labelClass, labelTextClass } from "./form-styles";

type Props = { slug: string; cta: string; fields: ToolField[] };

export function AIToolForm({ slug, cta, fields }: Props) {
  // Only fields the user has touched are present (and therefore sent).
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<ToolResultGroup[] | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setGroups(null);
    try {
      const res = await fetch(`/api/tools/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json().catch(() => null)) as { data?: { groups?: ToolResultGroup[] }; error?: string } | null;
      if (!res.ok) {
        setError(json?.error || "Something went wrong.");
      } else {
        setGroups(json?.data?.groups ?? []);
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={labelClass}>
            <span className={labelTextClass}>{field.label}</span>
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
              value={values[field.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              className={inputClass}
            />
          </label>
        ))}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-full bg-brand-700 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
          >
            {loading ? "Generating…" : cta}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {groups && groups.length === 0 && <p className="mt-4 text-sm text-ink/60">No results — try a more specific business type or location.</p>}

      {groups && groups.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2" aria-live="polite">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.text} className="text-sm text-ink">
                    <span className="font-medium">{item.text}</span>
                    {item.note && <span className="text-ink/50"> — {item.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
