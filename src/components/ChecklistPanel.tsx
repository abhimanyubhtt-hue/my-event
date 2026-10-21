import { useState } from "react";
import * as Icons from "lucide-react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { VENDOR_CATEGORIES } from "@/lib/presets";
import type { ChecklistItemRow, VendorCategory } from "@/types";

interface Props {
  items: ChecklistItemRow[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onAdd: (category: VendorCategory, label: string) => Promise<void>;
  onUpdate: (id: string, label: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  rose: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-500/30" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-500/30" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-700 dark:text-pink-300", ring: "ring-pink-500/30" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-700 dark:text-violet-300", ring: "ring-violet-500/30" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-300", ring: "ring-sky-500/30" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-500/30" },
};

export function ChecklistPanel({ items, onToggle, onAdd, onUpdate, onDelete }: Props) {
  const [addingTo, setAddingTo] = useState<VendorCategory | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const total = items.length;
  const done = items.filter((i) => i.completed).length;
  const overallPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleAdd = async (cat: VendorCategory) => {
    if (!newLabel.trim()) return;
    await onAdd(cat, newLabel);
    setNewLabel("");
    setAddingTo(null);
  };

  return (
    <section className="card p-6 md:p-7 animate-fade-up">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-9 w-9 rounded-xl bg-ink-900/5 dark:bg-white/10 flex items-center justify-center">
          <Icons.ClipboardList className="h-4.5 w-4.5 text-ink-700 dark:text-ink-200" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Vendor Checklist</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{done} of {total} tasks done · {overallPct}%</p>
        </div>
        <div className="h-2 w-24 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {VENDOR_CATEGORIES.map((vc) => {
          const meta = colorMap[vc.color];
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[vc.icon] ?? Icons.Circle;
          const catItems = items.filter((i) => i.category === vc.value);
          const catDone = catItems.filter((i) => i.completed).length;
          const catPct = catItems.length > 0 ? Math.round((catDone / catItems.length) * 100) : 0;

          return (
            <div key={vc.value} className={`rounded-xl border border-black/5 dark:border-white/10 p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-lg ${meta.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${meta.text}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{vc.label}</div>
                    <div className="text-[11px] text-ink-400">{catDone}/{catItems.length} done</div>
                  </div>
                </div>
                <button
                  onClick={() => setAddingTo(addingTo === vc.value ? null : vc.value)}
                  className="btn-ghost h-7 w-7 p-0"
                  title="Add task"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* per-category progress */}
              <div className="h-1 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden mb-3">
                <div className={`h-full transition-all duration-500 ${catPct === 100 ? "bg-emerald-500" : "bg-ink-400 dark:bg-ink-300"}`} style={{ width: `${catPct}%` }} />
              </div>

              {addingTo === vc.value && (
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                  <input
                    autoFocus
                    className="input h-9 py-1.5 text-sm"
                    placeholder="New task…"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd(vc.value);
                      if (e.key === "Escape") { setAddingTo(null); setNewLabel(""); }
                    }}
                  />
                  <button onClick={() => handleAdd(vc.value)} className="btn-primary h-9 px-3">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setAddingTo(null); setNewLabel(""); }} className="btn-ghost h-9 w-9 p-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <ul className="space-y-1.5">
                {catItems.length === 0 && (
                  <li className="text-xs text-ink-400 italic py-1">No tasks yet — add one with the + button.</li>
                )}
                {catItems.map((item) => (
                  <li key={item.id} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                    <button
                      onClick={() => onToggle(item.id, !item.completed)}
                      className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        item.completed
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-ink-300 dark:border-ink-600 hover:border-ink-500"
                      }`}
                    >
                      {item.completed && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          className="input h-8 py-1 text-sm flex-1"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { onUpdate(item.id, editLabel.trim()); setEditingId(null); }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button onClick={() => { onUpdate(item.id, editLabel.trim()); setEditingId(null); }} className="btn-ghost h-7 w-7 p-0"><Check className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost h-7 w-7 p-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 text-sm ${
                            item.completed
                              ? "line-through text-ink-400"
                              : "text-ink-700 dark:text-ink-200"
                          }`}
                        >
                          {item.label}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          <button
                            onClick={() => { setEditingId(item.id); setEditLabel(item.label); }}
                            className="btn-ghost h-7 w-7 p-0"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="btn-ghost h-7 w-7 p-0 text-rose-500 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
