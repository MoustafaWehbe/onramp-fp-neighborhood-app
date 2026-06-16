export type Status = "Reported" | "Acknowledged" | "In Progress" | "Resolved";
export type Category = "Roads" | "Lighting" | "Utilities" | "Sanitation" | "Parks" | "Noise" | "Safety";

export interface LogEntry {
  status: Status;
  at: string; // ISO
  by: string;
  note?: string;
}

export interface Comment {
  id: string;
  author: string;
  role: "Resident" | "Authority";
  at: string;
  text: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  neighborhood: string;
  address: string;
  status: Status;
  reporter: string;
  createdAt: string;
  upvotes: number;
  log: LogEntry[];
  comments: Comment[];
  aiRoutingNote?: string;
}

export const NEIGHBORHOODS = [
  "Riverside",
  "Oakwood",
  "Harbor Point",
  "Cedar Hills",
  "Maple Grove",
  "Sunset District",
];

export const CATEGORIES: Category[] = [
  "Roads",
  "Lighting",
  "Utilities",
  "Sanitation",
  "Parks",
  "Noise",
  "Safety",
];

const now = Date.now();
const days = (d: number) => new Date(now - d * 86400000).toISOString();

export const MOCK_ISSUES: Issue[] = [
  {
    id: "ISS-1042",
    title: "Large pothole on Elm Street near intersection",
    description:
      "Deep pothole roughly 60cm wide on Elm Street, just before the crossing with 4th Ave. Already damaged a tire this morning.",
    category: "Roads",
    neighborhood: "Riverside",
    address: "Elm St & 4th Ave",
    status: "In Progress",
    reporter: "Maya Chen",
    createdAt: days(6),
    upvotes: 24,
    aiRoutingNote: "Looks like a road surface issue — likely handled by the public works department.",
    log: [
      { status: "Reported", at: days(6), by: "Maya Chen" },
      { status: "Acknowledged", at: days(5), by: "City Works", note: "Inspection scheduled." },
      { status: "In Progress", at: days(2), by: "City Works", note: "Crew dispatched Tuesday morning." },
    ],
    comments: [
      { id: "c1", author: "Maya Chen", role: "Resident", at: days(4), text: "It got bigger after the rain last night." },
      { id: "c2", author: "City Works", role: "Authority", at: days(2), text: "Patch scheduled for tomorrow 9am, expect brief lane closure." },
    ],
  },
  {
    id: "ISS-1041",
    title: "Streetlight out on Cedar Lane for over a week",
    description: "The light at 22 Cedar Lane has been off since last Sunday. The whole block is dark at night.",
    category: "Lighting",
    neighborhood: "Cedar Hills",
    address: "22 Cedar Lane",
    status: "Acknowledged",
    reporter: "Jordan Pak",
    createdAt: days(4),
    upvotes: 12,
    aiRoutingNote: "This looks like a street lighting issue — likely handled by the public works department.",
    log: [
      { status: "Reported", at: days(4), by: "Jordan Pak" },
      { status: "Acknowledged", at: days(3), by: "Utilities Dept" },
    ],
    comments: [],
  },
  {
    id: "ISS-1040",
    title: "Overflowing trash bins at Oakwood Park",
    description: "Three bins near the playground are overflowing since the weekend event. Attracting pests.",
    category: "Sanitation",
    neighborhood: "Oakwood",
    address: "Oakwood Park, playground area",
    status: "Resolved",
    reporter: "Priya Shah",
    createdAt: days(8),
    upvotes: 31,
    aiRoutingNote: "This appears to be a waste collection issue — typically handled by sanitation services.",
    log: [
      { status: "Reported", at: days(8), by: "Priya Shah" },
      { status: "Acknowledged", at: days(7), by: "Sanitation" },
      { status: "In Progress", at: days(6), by: "Sanitation" },
      { status: "Resolved", at: days(5), by: "Sanitation", note: "Bins emptied, extra pickup scheduled for next weekend." },
    ],
    comments: [
      { id: "c3", author: "Sanitation", role: "Authority", at: days(5), text: "Resolved — added recurring pickup after events." },
    ],
  },
  {
    id: "ISS-1039",
    title: "Loud construction noise past 10pm",
    description: "Construction at the new building on 12 Harbor Road is running past city quiet hours every night.",
    category: "Noise",
    neighborhood: "Harbor Point",
    address: "12 Harbor Road",
    status: "Reported",
    reporter: "Sam Olsen",
    createdAt: days(1),
    upvotes: 8,
    aiRoutingNote: "This looks like a noise ordinance issue — likely reviewed by code enforcement.",
    log: [{ status: "Reported", at: days(1), by: "Sam Olsen" }],
    comments: [],
  },
  {
    id: "ISS-1038",
    title: "Broken swing in Maple Grove playground",
    description: "One of the swings has a snapped chain. Safety concern for small kids.",
    category: "Parks",
    neighborhood: "Maple Grove",
    address: "Maple Grove Playground",
    status: "Acknowledged",
    reporter: "Diane Wu",
    createdAt: days(3),
    upvotes: 17,
    aiRoutingNote: "This appears to be a parks maintenance issue — likely routed to parks & recreation.",
    log: [
      { status: "Reported", at: days(3), by: "Diane Wu" },
      { status: "Acknowledged", at: days(2), by: "Parks & Rec" },
    ],
    comments: [],
  },
  {
    id: "ISS-1037",
    title: "Water leak from sidewalk near Sunset Diner",
    description: "Steady trickle of water coming up from a crack in the sidewalk for 2 days.",
    category: "Utilities",
    neighborhood: "Sunset District",
    address: "Outside 88 Sunset Blvd",
    status: "In Progress",
    reporter: "Leo Martins",
    createdAt: days(5),
    upvotes: 19,
    aiRoutingNote: "This looks like a water main issue — typically handled by the utilities department.",
    log: [
      { status: "Reported", at: days(5), by: "Leo Martins" },
      { status: "Acknowledged", at: days(4), by: "Utilities Dept" },
      { status: "In Progress", at: days(2), by: "Utilities Dept", note: "Excavation crew on site." },
    ],
    comments: [],
  },
];

export const STATUS_FLOW: Status[] = ["Reported", "Acknowledged", "In Progress", "Resolved"];

export function statusColor(s: Status) {
  switch (s) {
    case "Reported": return "bg-status-reported/15 text-status-reported border-status-reported/30";
    case "Acknowledged": return "bg-status-acknowledged/15 text-status-acknowledged border-status-acknowledged/30";
    case "In Progress": return "bg-status-progress/15 text-status-progress border-status-progress/30";
    case "Resolved": return "bg-status-resolved/15 text-status-resolved border-status-resolved/30";
  }
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function aiSuggest(text: string): { category: Category; note: string } {
  const t = text.toLowerCase();
  if (/pothole|road|pavement|asphalt|crack/.test(t))
    return { category: "Roads", note: "Looks like a road surface issue — likely handled by the public works department." };
  if (/light|lamp|dark|streetlight|bulb/.test(t))
    return { category: "Lighting", note: "This looks like a street lighting issue — likely handled by the public works department." };
  if (/water|leak|pipe|sewer|gas|electric/.test(t))
    return { category: "Utilities", note: "This looks like a utilities issue — typically handled by the utilities department." };
  if (/trash|garbage|bin|litter|recycl/.test(t))
    return { category: "Sanitation", note: "This appears to be a waste collection issue — typically handled by sanitation services." };
  if (/park|playground|bench|tree/.test(t))
    return { category: "Parks", note: "This appears to be a parks maintenance issue — likely routed to parks & recreation." };
  if (/noise|loud|music|construction/.test(t))
    return { category: "Noise", note: "This looks like a noise ordinance issue — likely reviewed by code enforcement." };
  if (/unsafe|crime|hazard|danger/.test(t))
    return { category: "Safety", note: "This looks like a public safety concern — likely routed to community safety." };
  return { category: "Roads", note: "Couldn't confidently classify — please confirm the best category." };
}
