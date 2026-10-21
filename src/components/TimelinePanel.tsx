import { CalendarClock, Check } from "lucide-react";
import { generateTimeline } from "@/lib/generator";
import type { EventRow } from "@/types";

interface Props {
  event: EventRow;
}

export function TimelinePanel({ event }: Props) {
  const phases = generateTimeline(event.event_date, event.event_type);

  return (
    <section className="card p-6 md:p-7 animate-fade-up">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-9 w-9 rounded-xl bg-ink-900/5 dark:bg-white/10 flex items-center justify-center">
          <CalendarClock className="h-4.5 w-4.5 text-ink-700 dark:text-ink-200" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Planning Timeline</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">From kickoff to day-of execution</p>
        </div>
      </div>

      {!phases.length ? (
        <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-10 text-center">
          <div className="text-4xl mb-3">🗓️</div>
          <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto">
            Set an event date to generate a personalized countdown timeline.
          </p>
        </div>
      ) : (
        <ol className="relative border-l-2 border-ink-200/70 dark:border-ink-700/70 ml-2 space-y-6 pl-6">
          {phases.map((phase, i) => (
            <li key={i} className="relative animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="absolute -left-[1.65rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 dark:bg-ink-100 text-ink-50 dark:text-ink-900 text-[11px] font-semibold ring-4 ring-ink-50 dark:ring-ink-900">
                {i + 1}
              </span>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-ink-900 dark:text-ink-50">{phase.phase}</h4>
                <span className="chip bg-ink-900/5 dark:bg-white/10 text-ink-500 dark:text-ink-300 text-[10px]">
                  {phase.timeframe}
                </span>
              </div>
              <ul className="space-y-1.5">
                {phase.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                    <Check className="h-3.5 w-3.5 mt-0.5 text-ink-300 dark:text-ink-600 shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
