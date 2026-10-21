export type EventType = "wedding" | "birthday" | "community" | "corporate";

export type BudgetCategory =
  | "venue"
  | "catering"
  | "decor"
  | "entertainment"
  | "photography";

export type VendorCategory =
  | "venue"
  | "catering"
  | "decor"
  | "entertainment"
  | "photography"
  | "other";

export interface EventRow {
  id: string;
  title: string;
  event_type: EventType;
  budget: number;
  event_date: string | null;
  guest_count: number | null;
  vibe: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface BudgetAllocationRow {
  id: string;
  event_id: string;
  category: BudgetCategory;
  allocated: number;
  spent: number;
  created_at: string;
}

export interface ChecklistItemRow {
  id: string;
  event_id: string;
  category: VendorCategory;
  label: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface GeneratedTheme {
  name: string;
  description: string;
  palette: { name: string; hex: string }[];
  decor: string[];
  activities: string[];
}

export interface TimelinePhase {
  phase: string;
  timeframe: string;
  tasks: string[];
}
