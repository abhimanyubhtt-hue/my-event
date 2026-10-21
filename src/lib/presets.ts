import type { BudgetCategory, EventType, VendorCategory } from "@/types";

export const EVENT_TYPES: {
  value: EventType;
  label: string;
  emoji: string;
  blurb: string;
}[] = [
  {
    value: "wedding",
    label: "Wedding",
    emoji: "💍",
    blurb: "Celebrate the union of two people with elegance and joy.",
  },
  {
    value: "birthday",
    label: "Birthday",
    emoji: "🎂",
    blurb: "Make another trip around the sun unforgettable.",
  },
  {
    value: "community",
    label: "Community Event",
    emoji: "🤝",
    blurb: "Bring neighbors and friends together for a shared cause.",
  },
  {
    value: "corporate",
    label: "Corporate Party",
    emoji: "🏢",
    blurb: "Reward your team and strengthen company culture.",
  },
];

export const BUDGET_CATEGORIES: {
  value: BudgetCategory;
  label: string;
  defaultPct: number;
  color: string;
  icon: string;
}[] = [
  { value: "venue", label: "Venue", defaultPct: 0.3, color: "rose", icon: "MapPin" },
  { value: "catering", label: "Catering", defaultPct: 0.28, color: "amber", icon: "UtensilsCrossed" },
  { value: "decor", label: "Decor", defaultPct: 0.18, color: "pink", icon: "Sparkles" },
  { value: "entertainment", label: "Entertainment", defaultPct: 0.14, color: "violet", icon: "Music" },
  { value: "photography", label: "Photography", defaultPct: 0.1, color: "sky", icon: "Camera" },
];

export const VENDOR_CATEGORIES: {
  value: VendorCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: "venue", label: "Venue", icon: "MapPin", color: "rose" },
  { value: "catering", label: "Catering", icon: "UtensilsCrossed", color: "amber" },
  { value: "decor", label: "Decor", icon: "Sparkles", color: "pink" },
  { value: "entertainment", label: "Entertainment", icon: "Music", color: "violet" },
  { value: "photography", label: "Photography", icon: "Camera", color: "sky" },
  { value: "other", label: "Other", icon: "ClipboardList", color: "emerald" },
];

// Default checklist templates per vendor category
export const DEFAULT_CHECKLIST: Record<VendorCategory, string[]> = {
  venue: [
    "Shortlist 3 potential venues",
    "Request quotes and availability",
    "Schedule site visits",
    "Confirm date and sign contract",
    "Pay deposit and secure booking",
  ],
  catering: [
    "Research caterers and read reviews",
    "Schedule tasting sessions",
    "Finalize menu and dietary options",
    "Confirm headcount with caterer",
    "Arrange serving staff and equipment",
  ],
  decor: [
    "Gather inspiration and mood boards",
    "Hire a decorator or DIY plan",
    "Order florals and centerpieces",
    "Plan lighting and signage",
    "Confirm delivery and setup times",
  ],
  entertainment: [
    "Decide on music (DJ, live band, playlist)",
    "Book entertainer or MC",
    "Plan activities or games",
    "Confirm sound equipment needs",
    "Set performance schedule",
  ],
  photography: [
    "Research and shortlist photographers",
    "Review portfolios and packages",
    "Book photographer and sign contract",
    "Share shot list and key moments",
    "Confirm delivery timeline for photos",
  ],
  other: [
    "Send invitations",
    "Plan seating arrangement",
    "Arrange transportation",
    "Prepare emergency kit",
  ],
};
