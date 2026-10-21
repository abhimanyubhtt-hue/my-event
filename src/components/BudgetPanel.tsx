import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { BUDGET_CATEGORIES } from "@/lib/presets";
import type { BudgetAllocationRow, EventRow } from "@/types";

interface Props {
  event: EventRow;
  allocations: BudgetAllocationRow[];
  onUpdate: (id: string, patch: Partial<BudgetAllocationRow>) => Promise<void>;
}

const colorMap: Record<string, { bar: string; bg: string; text: string; dot: string }> = {
  rose: { bar: "bg-rose-500", bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500" },
  amber: { bar: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  pink: { bar: "bg-pink-500", bg: "bg-pink-500/10", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500" },
  violet: { bar: "bg-violet-500", bg: "bg-violet-500/10", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  sky: { bar: "bg-sky-500", bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-300", dot: "bg-sky-500" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function BudgetPanel({ event, allocations, onUpdate }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  const budget = Number(event.budget) || 0;
  const totalAllocated = useMemo(
    () => allocations.reduce((s, a) => s + Number(a.allocated), 0),
    [allocations],
  );
  const totalSpent = useMemo(
    () => allocations.reduce((s, a) => s + Number(a.spent), 0),
    [allocations],
  );
  const remaining = budget - totalAllocated;

  const startEdit = (a: BudgetAllocationRow, field: "allocated" | "spent") => {
    setEditing(`${a.id}-${field}`);
    setDraft(String(a[field]));
  };

  const commit = (a: BudgetAllocationRow, field: "allocated" | "spent") => {
    const val = Number(draft) || 0;
    if (val !== a[field]) {
      onUpdate(a.id, { [field]: val });
    }
    setEditing(null);
  };

  return (
    <section className="card p-6 md:p-7 animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-ink-900/5 dark:bg-white/10 flex items-center justify-center">
            <Icons.Wallet className="h-4.5 w-4.5 text-ink-700 dark:text-ink-200" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Smart Budget</h3>
            <p className="text-xs text-ink-500 dark:text-ink-400">Track allocations vs. spend</p>
          </div>
        </div>
      </div>

      {/* Overall bar */}
      <div className="rounded-xl bg-ink-50 dark:bg-ink-900/40 p-4 mb-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-ink-500 dark:text-ink-400">Total allocated of {fmt(budget)}</span>
          <span className={remaining < 0 ? "text-rose-600 font-semibold" : "text-ink-700 dark:text-ink-200 font-semibold"}>
            {remaining >= 0 ? `${fmt(remaining)} remaining` : `${fmt(Math.abs(remaining))} over budget`}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-ink-200 dark:bg-ink-700 overflow-hidden flex">
          {allocations.map((a) => {
            const pct = budget > 0 ? (Number(a.allocated) / budget) * 100 : 0;
            const meta = colorMap[BUDGET_CATEGORIES.find((c) => c.value === a.category)?.color ?? "sky"];
            return (
              <div
                key={a.id}
                className={`${meta.bar} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${a.category}: ${fmt(Number(a.allocated))}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs mt-2 text-ink-400">
          <span>Spent: {fmt(totalSpent)}</span>
          <span>Allocated: {fmt(totalAllocated)}</span>
        </div>
      </div>

      {/* Category rows */}
      <div className="space-y-3">
        {allocations.map((a) => {
          const meta = BUDGET_CATEGORIES.find((c) => c.value === a.category)!;
          const cm = colorMap[meta.color];
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[meta.icon] ?? Icons.Circle;
          const pctAlloc = budget > 0 ? (Number(a.allocated) / budget) * 100 : 0;
          const pctSpent = Number(a.allocated) > 0 ? (Number(a.spent) / Number(a.allocated)) * 100 : 0;
          const isEditAlloc = editing === `${a.id}-allocated`;
          const isEditSpent = editing === `${a.id}-spent`;

          return (
            <div key={a.id} className="rounded-xl border border-black/5 dark:border-white/10 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-lg ${cm.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${cm.text}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{meta.label}</div>
                    <div className="text-[11px] text-ink-400">{pctAlloc.toFixed(0)}% of total budget</div>
                  </div>
                </div>
                <div className="text-right">
                  {isEditAlloc ? (
                    <input
                      autoFocus
                      type="number"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => commit(a, "allocated")}
                      onKeyDown={(e) => e.key === "Enter" && commit(a, "allocated")}
                      className="input h-8 w-28 text-right py-1"
                    />
                  ) : (
                    <button
                      onClick={() => startEdit(a, "allocated")}
                      className="text-sm font-semibold text-ink-900 dark:text-ink-50 hover:underline"
                    >
                      {fmt(Number(a.allocated))}
                    </button>
                  )}
                </div>
              </div>
              {/* Allocated bar */}
              <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden mb-2">
                <div className={`${cm.bar} h-full transition-all duration-500`} style={{ width: `${Math.min(pctAlloc, 100)}%` }} />
              </div>
              {/* Spent row */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 dark:text-ink-400">
                  Spent:{" "}
                  {isEditSpent ? (
                    <input
                      autoFocus
                      type="number"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => commit(a, "spent")}
                      onKeyDown={(e) => e.key === "Enter" && commit(a, "spent")}
                      className="input h-7 w-24 text-right py-0.5 inline-block align-middle"
                    />
                  ) : (
                    <button onClick={() => startEdit(a, "spent")} className="font-medium text-ink-700 dark:text-ink-200 hover:underline">
                      {fmt(Number(a.spent))}
                    </button>
                  )}
                </span>
                <span className={pctSpent > 100 ? "text-rose-600 font-semibold" : "text-ink-500 dark:text-ink-400"}>
                  {pctSpent.toFixed(0)}% used
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden mt-1.5">
                <div
                  className={`${pctSpent > 100 ? "bg-rose-500" : "bg-ink-400"} h-full transition-all duration-500`}
                  style={{ width: `${Math.min(pctSpent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
