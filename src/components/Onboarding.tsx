import { useState } from "react";
import { EVENT_TYPES } from "@/lib/presets";
import type { EventType } from "@/types";

interface Props {
  onCreate: (input: {
    title: string;
    event_type: EventType;
    budget: number;
    event_date: string | null;
    guest_count: number | null;
    vibe: string | null;
  }) => Promise<unknown>;
}

export function Onboarding({ onCreate }: Props) {
  const [eventType, setEventType] = useState<EventType>("birthday");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(10000);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [vibe, setVibe] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedType = EVENT_TYPES.find((t) => t.value === eventType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onCreate({
      title: title.trim() || `${selectedType.label} Celebration`,
      event_type: eventType,
      budget: Number(budget) || 0,
      event_date: date || null,
      guest_count: guests ? Number(guests) : null,
      vibe: vibe.trim() || null,
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-200/40 dark:bg-rose-900/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-amber-200/40 dark:bg-amber-900/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative w-full max-w-3xl animate-fade-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 chip bg-ink-900/5 dark:bg-white/10 text-ink-700 dark:text-ink-200 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plan your perfect celebration
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink-900 dark:text-ink-50 mb-3">
            Let's design something <span className="text-gradient">unforgettable</span>
          </h1>
          <p className="text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
            Answer a few questions and we'll generate a personalized theme, smart budget,
            timeline, and vendor checklist — all in one elegant dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-7">
          {/* Event type selector */}
          <div>
            <span className="label">What are you celebrating?</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setEventType(t.value)}
                  className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                    eventType === t.value
                      ? "border-ink-900 dark:border-white bg-ink-900/5 dark:bg-white/10 scale-[1.02]"
                      : "border-black/10 dark:border-white/10 hover:border-ink-400 dark:hover:border-ink-500"
                  }`}
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{t.label}</div>
                  <div className="text-[11px] text-ink-500 dark:text-ink-400 mt-1 leading-snug">{t.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="label" htmlFor="title">Event name <span className="text-ink-400 normal-case font-normal">(optional)</span></label>
            <input
              id="title"
              className="input"
              placeholder={`e.g. Sarah's 30th Birthday`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Budget + Date */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label" htmlFor="budget">Overall budget</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">$</span>
                <input
                  id="budget"
                  type="number"
                  min={0}
                  step={100}
                  className="input pl-7"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3 accent-ink-900 dark:accent-white"
              />
              <div className="flex justify-between text-[11px] text-ink-400 mt-1">
                <span>$500</span><span>$100,000</span>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="date">Event date</label>
              <input
                id="date"
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Guests + Vibe */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label" htmlFor="guests">Guest count <span className="text-ink-400 normal-case font-normal">(optional)</span></label>
              <input
                id="guests"
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 80"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="vibe">Vibe / style <span className="text-ink-400 normal-case font-normal">(optional)</span></label>
              <input
                id="vibe"
                className="input"
                placeholder="e.g. warm, rustic, candlelit"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-ink-400">Your data is saved automatically as you plan.</p>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? "Setting up…" : "Start planning"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
