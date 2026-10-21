import { useState } from "react";
import { Sparkles, Wand2, Check } from "lucide-react";
import { generateTheme } from "@/lib/generator";
import type { EventRow, GeneratedTheme } from "@/types";

interface Props {
  event: EventRow;
}

export function AIThemePanel({ event }: Props) {
  const [theme, setTheme] = useState<GeneratedTheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate "thinking" for a more interactive feel
    setTimeout(() => {
      const result = generateTheme({
        eventType: event.event_type,
        vibe: event.vibe ?? "",
        budget: Number(event.budget),
        guestCount: event.guest_count ?? 0,
        date: event.event_date,
      });
      setTheme(result);
      setLoading(false);
    }, 700);
  };

  const copyPalette = () => {
    if (!theme) return;
    const text = theme.palette.map((p) => `${p.name}: ${p.hex}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied("palette");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="card p-6 md:p-7 animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ink-900 to-ink-700 dark:from-ink-100 dark:to-ink-300 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-ink-50 dark:text-ink-900" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">AI Theme Studio</h3>
            <p className="text-xs text-ink-500 dark:text-ink-400">Personalized themes, palettes & ideas</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          <Wand2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {theme ? "Regenerate" : "Generate"}
        </button>
      </div>

      {!theme && !loading && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-10 text-center">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto">
            Tap <span className="font-semibold text-ink-700 dark:text-ink-200">Generate</span> and we'll craft a custom theme
            based on your event type, budget, vibe, and guest count.
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="h-6 w-2/3 rounded-lg bg-ink-200/60 dark:bg-ink-700/50 animate-pulse" />
          <div className="h-20 rounded-xl bg-ink-200/40 dark:bg-ink-700/30 animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 rounded-xl bg-ink-200/40 dark:bg-ink-700/30 animate-pulse" />
            <div className="h-28 rounded-xl bg-ink-200/40 dark:bg-ink-700/30 animate-pulse" />
          </div>
        </div>
      )}

      {theme && !loading && (
        <div className="mt-6 space-y-6 animate-fade-up">
          <div>
            <h4 className="font-display text-2xl font-semibold text-gradient mb-2">{theme.name}</h4>
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{theme.description}</p>
          </div>

          {/* Palette */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">Color Palette</h5>
              <button onClick={copyPalette} className="btn-ghost text-xs h-7 px-2.5">
                {copied === "palette" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : null}
                {copied === "palette" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {theme.palette.map((p, i) => (
                <div key={i} className="group">
                  <div
                    className="aspect-square rounded-xl shadow-sm transition-transform group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10"
                    style={{ backgroundColor: p.hex }}
                  />
                  <div className="mt-1.5 text-[10px] font-medium text-ink-500 dark:text-ink-400 truncate">{p.name}</div>
                  <div className="text-[10px] text-ink-400 font-mono">{p.hex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decor */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2.5">Decor Concepts</h5>
              <ul className="space-y-2">
                {theme.decor.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-ink-400 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2.5">Activity Ideas</h5>
              <ul className="space-y-2">
                {theme.activities.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-ink-400 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
