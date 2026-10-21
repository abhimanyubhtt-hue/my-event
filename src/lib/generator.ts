import type { EventType, GeneratedTheme, TimelinePhase } from "@/types";

// Deterministic pseudo-random based on a string seed, so the same inputs always
// produce the same theme (feels consistent / "personalized") while different
// inputs produce visibly different results.
function seeded(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(rng: () => number, arr: T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return out;
}

interface ThemeInput {
  eventType: EventType;
  vibe: string;
  budget: number;
  guestCount: number;
  date: string | null;
}

// Each base palette has a name + 5 hex colors designed to look cohesive.
const PALETTES: { name: string; hex: string[] }[] = [
  { name: "Blush & Ivory", hex: ["#F7E7E7", "#E8C5C5", "#C9898C", "#7C5A58", "#3D2B2A"] },
  { name: "Midnight Gold", hex: ["#0F111A", "#1E2233", "#3A3E5C", "#C9A961", "#F4E4B8"] },
  { name: "Sage & Stone", hex: ["#EDEAE3", "#C7CBB7", "#8A9A78", "#5C6B4F", "#2E3526"] },
  { name: "Rosewood", hex: ["#F3E1E1", "#D9A6A6", "#A85C5C", "#6B3B3B", "#3A2222"] },
  { name: "Ocean Mist", hex: ["#EAF2F4", "#B7D4DD", "#6FA0B0", "#3C6E80", "#1F4655"] },
  { name: "Terracotta Dream", hex: ["#F6E9DC", "#E2B59A", "#C07A5A", "#8A4E36", "#4E2D1E"] },
  { name: "Lavender Fields", hex: ["#F1ECF7", "#D6C5E8", "#A98DC6", "#735B9A", "#3F2E5C"] },
  { name: "Emerald & Cream", hex: ["#F2F1E7", "#D7DEC0", "#8FA37E", "#4F6B47", "#243024"] },
  { name: "Sunset Coral", hex: ["#FDEEE3", "#F8C9A0", "#E98A6B", "#B5563C", "#6B2F25"] },
  { name: "Ivory & Ink", hex: ["#F7F5F0", "#D9D6CB", "#8C8B83", "#4A4A48", "#1A1A1A"] },
  { name: "Sapphire Night", hex: ["#E8EDF6", "#A9B8D8", "#5A78A8", "#2C4670", "#11254A"] },
  { name: "Desert Bloom", hex: ["#F7EDE0", "#E0C2A0", "#B88860", "#7A5238", "#3D2618"] },
];

const DECOR_BY_TYPE: Record<EventType, string[]> = {
  wedding: [
    "Floral arch with cascading greenery",
    "Long banquet tables with runner greenery",
    "Hanging Edison bulb or fairy-light installations",
    "Candle-lined aisle with rose petals",
    "Hand-lettered welcome sign with bespoke seating chart",
    "Statement backdrop for the sweetheart table",
    "Lounge vignettes with velvet seating",
  ],
  birthday: [
    "Balloon garland in palette colors with metallic accents",
    "Custom neon sign with the guest of honor's name",
    "Dessert table with tiered cake and treats",
    "Photo wall with printed memories of the guest of honor",
    "Confetti and streamer ceiling installation",
    "Themed table centerpieces with candles",
  ],
  community: [
    "Banners and flags with event branding",
    "Communal seating with mixed table styles",
    "DIY decoration station for attendees",
    "Bunting and paper-lantern overhead decor",
    "Community message or wishes wall",
    "Upcycled material centerpieces",
  ],
  corporate: [
    "Branded step-and-repeat backdrop",
    "LED-lit entrance tunnel in company colors",
    "Modern lounge pods for networking",
    "Custom podium and branded signage",
    "Projection-mapped stage backdrop",
    "Table centerpieces with branded accents",
  ],
};

const ACTIVITIES_BY_TYPE: Record<EventType, string[]> = {
  wedding: [
    "Cocktail hour with live acoustic music",
    "First dance and parent dances",
    "Toasts and speeches from loved ones",
    "Interactive photo booth with props",
    "Group dance set with a high-energy playlist",
    "Late-night snack bar or food truck",
    "Send-off with sparklers or lanterns",
  ],
  birthday: [
    "Surprise entrance reveal for the guest of honor",
    "Personalized trivia game about the celebrant",
    "Memory video montage",
    "Cake cutting and birthday song",
    "Dance-off with fun prizes",
    "Themed costume or dress-code moment",
    "Open mic for friends to share wishes",
  ],
  community: [
    "Welcome circle and introductions",
    "Group art or mural project",
    "Potluck or shared meal tasting",
    "Local talent showcase stage",
    "Kids zone with supervised games",
    "Raffle or fundraiser moment",
    "Group photo with all attendees",
  ],
  corporate: [
    "Welcome address and company highlights",
    "Team-building game or trivia challenge",
    "Awards and recognition ceremony",
    "Networking cocktail hour",
    "Guest keynote or fireside chat",
    "Photo booth with branded props",
    "After-party with DJ and dancing",
  ],
};

const THEME_NAMES_BY_TYPE: Record<EventType, string[]> = {
  wedding: [
    "Timeless Romance",
    "Garden Whimsy",
    "Modern Minimal",
    "Vintage Elegance",
    "Celestial Affair",
    "Rustic Botanical",
  ],
  birthday: [
    "Playful Pop",
    "Retro Disco",
    "Glam & Glow",
    "Cozy & Cinematic",
    "Neon Nights",
    "Garden Party",
  ],
  community: [
    "Hometown Hearts",
    "Festival of Lights",
    "Together Fest",
    "Color Block Carnival",
    "Neighborhood Block Party",
  ],
  corporate: [
    "Future Forward",
    "Innovation Gala",
    "Momentum Summit",
    "After Hours",
    "The Achievement Awards",
  ],
};

export function generateTheme(input: ThemeInput): GeneratedTheme {
  const seed = `${input.eventType}|${input.vibe}|${input.budget}|${input.guestCount}|${input.date ?? ""}`;
  const rng = seeded(seed);

  const base = pick(rng, PALETTES);
  const name = pick(rng, THEME_NAMES_BY_TYPE[input.eventType]);

  // Scale decor & activity counts by budget tier
  const budgetTier = input.budget >= 50000 ? "luxury" : input.budget >= 15000 ? "elevated" : "essential";
  const decorCount = budgetTier === "luxury" ? 6 : budgetTier === "elevated" ? 5 : 4;
  const activityCount = budgetTier === "luxury" ? 7 : 5;

  const decor = pickN(rng, DECOR_BY_TYPE[input.eventType], decorCount);
  const activities = pickN(rng, ACTIVITIES_BY_TYPE[input.eventType], activityCount);

  // Budget tier description
  const tierLabel =
    budgetTier === "luxury"
      ? "a luxury, no-detail-spared experience"
      : budgetTier === "elevated"
        ? "an elevated, polished celebration"
        : "a warm, essential celebration";

  const guestNote = input.guestCount
    ? ` for ${input.guestCount} guests`
    : "";
  const vibeNote = input.vibe.trim()
    ? ` reflecting a ${input.vibe.trim().toLowerCase()} atmosphere`
    : "";

  const description = `${name} is designed as ${tierLabel}${guestNote}${vibeNote}. The palette draws from ${base.name} to set a cohesive, intentional mood across every touchpoint.`;

  return {
    name,
    description,
    palette: base.hex.map((hex, i) => ({
      name: i === 0 ? "Base" : i === 4 ? "Accent" : `Tone ${i}`,
      hex,
    })),
    decor,
    activities,
  };
}

export function generateTimeline(
  eventDate: string | null,
  eventType: EventType,
): TimelinePhase[] {
  if (!eventDate) return [];

  const target = new Date(eventDate + "T12:00:00");
  const now = new Date();
  const weeksAway = Math.max(
    0,
    Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)),
  );

  const basePhases: Omit<TimelinePhase, "timeframe">[] = [
    {
      phase: "Vision & Foundation",
      tasks: [
        "Define the overall theme and color palette",
        "Set the working budget and split across categories",
        "Reserve the date with key attendees",
        "Create a Pinterest or inspiration board",
      ],
    },
    {
      phase: "Booking Core Vendors",
      tasks: [
        "Book the venue",
        "Secure caterer and finalize menu direction",
        "Hire photographer / videographer",
        "Book entertainment (DJ, band, or MC)",
      ],
    },
    {
      phase: "Design & Details",
      tasks: [
        "Finalize decor plan and florals",
        "Order or commission signage and stationery",
        "Send out invitations or save-the-dates",
        "Plan activities, speeches, and run-of-show",
      ],
    },
    {
      phase: "Final Countdown",
      tasks: [
        "Confirm final headcount with all vendors",
        "Review and approve vendor contracts",
        "Finalize seating and layout",
        "Prepare day-of timeline and share with team",
      ],
    },
    {
      phase: "Day-of Execution",
      tasks: [
        eventType === "wedding"
          ? "Hair & makeup, then ceremony setup"
          : "Venue setup and decor install",
        "Welcome guests and kick off the program",
        "Run the scheduled activities and toasts",
        "Capture key photo moments",
        "Tear down and vendor load-out",
      ],
    },
  ];

  // Map phases to timeframes relative to the event date
  const timeframes = weeksAway >= 16
    ? ["16+ weeks out", "10-12 weeks out", "6-8 weeks out", "2-4 weeks out", "Day of"]
    : weeksAway >= 8
      ? ["8+ weeks out", "6 weeks out", "4 weeks out", "1-2 weeks out", "Day of"]
      : weeksAway >= 4
        ? ["4 weeks out", "3 weeks out", "2 weeks out", "1 week out", "Day of"]
        : ["Now", "1-2 weeks out", "2 weeks out", "3-4 days out", "Day of"];

  return basePhases.map((p, i) => ({
    ...p,
    timeframe: timeframes[i] ?? p.phase,
  }));
}
