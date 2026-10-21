import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useEvent } from "@/hooks/useEvent";
import { EVENT_TYPES } from "@/lib/presets";
import { Header } from "@/components/Header";
import { Onboarding } from "@/components/Onboarding";
import { HeroSummary } from "@/components/HeroSummary";
import { AIThemePanel } from "@/components/AIThemePanel";
import { BudgetPanel } from "@/components/BudgetPanel";
import { TimelinePanel } from "@/components/TimelinePanel";
import { ChecklistPanel } from "@/components/ChecklistPanel";
import { CalendarClock, Sparkles, Wallet, ClipboardList, Loader2 } from "lucide-react";

function App() {
  const { theme, toggle } = useTheme();
  const {
    event,
    allocations,
    checklist,
    loading,
    error,
    createEvent,
    updateAllocation,
    toggleChecklistItem,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    resetAll,
  } = useEvent();

  const [confirmReset, setConfirmReset] = useState(false);

  const typeLabel = event
    ? EVENT_TYPES.find((t) => t.value === event.event_type)?.label
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-900">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-ink-50 transition-colors">
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onReset={() => setConfirmReset(true)}
        eventTitle={event?.title}
        eventTypeLabel={typeLabel}
      />

      {!event ? (
        <Onboarding onCreate={createEvent} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
          {error && (
            <div className="card p-4 border-l-4 border-l-rose-500 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <HeroSummary event={event} />

          {/* Section nav */}
          <nav className="flex flex-wrap gap-2">
            <NavChip icon={<Sparkles className="h-3.5 w-3.5" />} label="AI Theme" target="theme" />
            <NavChip icon={<Wallet className="h-3.5 w-3.5" />} label="Budget" target="budget" />
            <NavChip icon={<CalendarClock className="h-3.5 w-3.5" />} label="Timeline" target="timeline" />
            <NavChip icon={<ClipboardList className="h-3.5 w-3.5" />} label="Checklist" target="checklist" />
          </nav>

          <div id="theme" className="scroll-mt-20">
            <AIThemePanel event={event} />
          </div>

          <div id="budget" className="grid lg:grid-cols-2 gap-6 md:gap-8 scroll-mt-20">
            <BudgetPanel event={event} allocations={allocations} onUpdate={updateAllocation} />
            <div id="timeline" className="scroll-mt-20">
              <TimelinePanel event={event} />
            </div>
          </div>

          <div id="checklist" className="scroll-mt-20">
            <ChecklistPanel
              items={checklist}
              onToggle={toggleChecklistItem}
              onAdd={addChecklistItem}
              onUpdate={updateChecklistItem}
              onDelete={deleteChecklistItem}
            />
          </div>

          <footer className="text-center text-xs text-ink-400 py-6">
            Soirée · Your celebration, beautifully planned.
          </footer>
        </main>
      )}

      {/* Reset confirmation */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-sm w-full animate-scale-in">
            <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2">Start a new event?</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-5">
              This will permanently delete the current event, its budget, and checklist. This can't be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={async () => { await resetAll(); setConfirmReset(false); }}
                className="btn bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete & start fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavChip({ icon, label, target }: { icon: React.ReactNode; label: string; target: string }) {
  return (
    <a
      href={`#${target}`}
      className="chip bg-white/60 dark:bg-ink-900/40 border border-black/5 dark:border-white/10 text-ink-600 dark:text-ink-300 hover:bg-white dark:hover:bg-ink-800 transition"
    >
      {icon}
      {label}
    </a>
  );
}

export default App;
