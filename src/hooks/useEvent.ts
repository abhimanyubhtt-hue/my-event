import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BUDGET_CATEGORIES, DEFAULT_CHECKLIST } from "@/lib/presets";
import type {
  BudgetAllocationRow,
  ChecklistItemRow,
  EventRow,
  EventType,
  VendorCategory,
} from "@/types";

interface NewEventInput {
  title: string;
  event_type: EventType;
  budget: number;
  event_date: string | null;
  guest_count: number | null;
  vibe: string | null;
}

export function useEvent() {
  const [event, setEvent] = useState<EventRow | null>(null);
  const [allocations, setAllocations] = useState<BudgetAllocationRow[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the most recent event on mount (single-tenant — there is effectively one active event).
  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (!data) {
      setEvent(null);
      setAllocations([]);
      setChecklist([]);
      setLoading(false);
      return;
    }
    const ev = data as EventRow;
    setEvent(ev);

    const [allocRes, checkRes] = await Promise.all([
      supabase.from("budget_allocations").select("*").eq("event_id", ev.id),
      supabase.from("checklist_items").select("*").eq("event_id", ev.id).order("sort_order", { ascending: true }),
    ]);
    if (allocRes.data) setAllocations(allocRes.data as BudgetAllocationRow[]);
    if (checkRes.data) setChecklist(checkRes.data as ChecklistItemRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const createEvent = useCallback(
    async (input: NewEventInput) => {
      setError(null);
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: input.title,
          event_type: input.event_type,
          budget: input.budget,
          event_date: input.event_date,
          guest_count: input.guest_count,
          vibe: input.vibe,
          settings: {},
        })
        .select()
        .single();
      if (error || !data) {
        setError(error?.message ?? "Failed to create event");
        return null;
      }
      const ev = data as EventRow;
      setEvent(ev);

      // Seed default budget allocations based on category defaults
      const allocRows = BUDGET_CATEGORIES.map((c) => ({
        event_id: ev.id,
        category: c.value,
        allocated: Math.round(input.budget * c.defaultPct),
        spent: 0,
      }));
      const { data: allocData } = await supabase
        .from("budget_allocations")
        .insert(allocRows)
        .select();
      if (allocData) setAllocations(allocData as BudgetAllocationRow[]);

      // Seed default checklist items across all vendor categories
      const checkRows: Omit<ChecklistItemRow, "id" | "created_at">[] = [];
      let order = 0;
      (Object.keys(DEFAULT_CHECKLIST) as VendorCategory[]).forEach((cat) => {
        DEFAULT_CHECKLIST[cat].forEach((label) => {
          checkRows.push({
            event_id: ev.id,
            category: cat,
            label,
            completed: false,
            sort_order: order++,
          });
        });
      });
      const { data: checkData } = await supabase
        .from("checklist_items")
        .insert(checkRows)
        .select();
      if (checkData) setChecklist(checkData as ChecklistItemRow[]);

      return ev;
    },
    [],
  );

  const updateEvent = useCallback(
    async (patch: Partial<EventRow>) => {
      if (!event) return;
      const { data, error } = await supabase
        .from("events")
        .update(patch)
        .eq("id", event.id)
        .select()
        .single();
      if (error) {
        setError(error.message);
        return;
      }
      setEvent({ ...event, ...(data as EventRow) });
    },
    [event],
  );

  const updateAllocation = useCallback(
    async (id: string, patch: Partial<BudgetAllocationRow>) => {
      const { error } = await supabase.from("budget_allocations").update(patch).eq("id", id);
      if (error) {
        setError(error.message);
        return;
      }
      setAllocations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
    },
    [],
  );

  const toggleChecklistItem = useCallback(
    async (id: string, completed: boolean) => {
      const { error } = await supabase
        .from("checklist_items")
        .update({ completed })
        .eq("id", id);
      if (error) return;
      setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, completed } : c)));
    },
    [],
  );

  const addChecklistItem = useCallback(
    async (category: VendorCategory, label: string) => {
      if (!event || !label.trim()) return;
      const sortOrder = checklist.length;
      const { data, error } = await supabase
        .from("checklist_items")
        .insert({
          event_id: event.id,
          category,
          label: label.trim(),
          completed: false,
          sort_order: sortOrder,
        })
        .select()
        .single();
      if (error || !data) return;
      setChecklist((prev) => [...prev, data as ChecklistItemRow]);
    },
    [event, checklist.length],
  );

  const updateChecklistItem = useCallback(
    async (id: string, label: string) => {
      const { error } = await supabase
        .from("checklist_items")
        .update({ label })
        .eq("id", id);
      if (error) return;
      setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
    },
    [],
  );

  const deleteChecklistItem = useCallback(async (id: string) => {
    const { error } = await supabase.from("checklist_items").delete().eq("id", id);
    if (error) return;
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetAll = useCallback(async () => {
    if (!event) return;
    await supabase.from("events").delete().eq("id", event.id);
    setEvent(null);
    setAllocations([]);
    setChecklist([]);
  }, [event]);

  return {
    event,
    allocations,
    checklist,
    loading,
    error,
    createEvent,
    updateEvent,
    updateAllocation,
    toggleChecklistItem,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    resetAll,
    refresh: loadEvent,
  };
}
