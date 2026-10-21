import { Moon, Sun, PartyPopper, RotateCcw } from "lucide-react";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onReset: () => void;
  eventTitle?: string;
  eventTypeLabel?: string;
}

export function Header({ theme, onToggleTheme, onReset, eventTitle, eventTypeLabel }: Props) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-ink-900 dark:bg-ink-100 flex items-center justify-center shrink-0">
            <PartyPopper className="h-5 w-5 text-ink-50 dark:text-ink-900" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50 truncate leading-tight">
              {eventTitle ?? "Soirée"}
            </h1>
            {eventTypeLabel && (
              <p className="text-[11px] text-ink-500 dark:text-ink-400 truncate">{eventTypeLabel}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onReset && eventTitle && (
            <button
              onClick={onReset}
              className="btn-ghost hidden sm:inline-flex"
              title="Start a new event"
            >
              <RotateCcw className="h-4 w-4" />
              New
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className="btn-outline h-9 w-9 p-0"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
