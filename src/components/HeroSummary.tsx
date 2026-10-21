import { CalendarDays, Users, Wallet } from "lucide-react";
import type { EventRow } from "@/types";
import { EVENT_TYPES } from "@/lib/presets";

interface Props {
  event: EventRow;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string | null) {
  if (!d) return "Date TBD";
  const date = new Date(d + "T12:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function daysAway(d: string | null) {
  if (!d) return null;
  const target = new Date(d + "T12:00:00");
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function HeroSummary({ event }: Props) {
  const typeMeta = EVENT_TYPES.find((t) => t.value === event.event_type);
  const days = daysAway(event.event_date);
  const countdown = days === null ? null : days > 0 ? `${days} days to go` : days === 0 ? "Today is the day!" : `${Math.abs(days)} days ago`;

  return (
    <section className="card p-6 md:p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-rose-300/30 to-amber-300/30 dark:from-rose-900/20 dark:to-amber-900/10 blur-2xl" />
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="chip bg-ink-900/5 dark:bg-white/10 text-ink-700 dark:text-ink-200 mb-3">
            <span>{typeMeta?.emoji}</span> {typeMeta?.label}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 dark:text-ink-50 mb-2">
            {event.title}
          </h2>
          {countdown && (
            <p className="text-ink-500 dark:text-ink-400 text-sm">{countdown}</p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          <Stat icon={<Wallet className="h-4 w-4" />} label="Budget" value={formatCurrency(Number(event.budget))} />
          <Stat icon={<CalendarDays className="h-4 w-4" />} label="Date" value={formatDate(event.event_date)} />
          <Stat icon={<Users className="h-4 w-4" />} label="Guests" value={event.guest_count ? String(event.guest_count) : "—"} />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-ink-900/40 border border-black/5 dark:border-white/10 px-3.5 py-3 min-w-0">
      <div className="flex items-center gap-1.5 text-ink-400 mb-1">{icon}<span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span></div>
      <div className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{value}</div>
    </div>
  );
}
