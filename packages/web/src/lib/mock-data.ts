export type Status = "Reported" | "Acknowledged" | "In Progress" | "Resolved";
export type Category =
  | "Roads"
  | "Lighting"
  | "Utilities"
  | "Sanitation"
  | "Parks"
  | "Noise"
  | "Safety";

export interface LogEntry {
  status: Status;
  at: string;
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
  "Hamra",
  "Achrafieh",
  "Bourj Hammoud",
  "Verdun",
  "Dekwaneh",
  "Jounieh",
  "Tyre",
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
    title: "Massive pothole on Rue Bliss near AUB gate",
    description:
      "A deep pothole about 70cm wide has opened up on Rue Bliss just before the AUB main gate. Already caused two flat tires this week.",
    category: "Roads",
    neighborhood: "Hamra",
    address: "Rue Bliss, near AUB Main Gate",
    status: "In Progress",
    reporter: "Nour Khalil",
    createdAt: days(6),
    upvotes: 34,
    aiRoutingNote:
      "Looks like a road surface issue — likely handled by the municipality's public works department.",
    log: [
      { status: "Reported", at: days(6), by: "Nour Khalil" },
      {
        status: "Acknowledged",
        at: days(5),
        by: "Beirut Municipality",
        note: "Inspection scheduled.",
      },
      {
        status: "In Progress",
        at: days(2),
        by: "Beirut Municipality",
        note: "Crew dispatched Monday morning.",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "Nour Khalil",
        role: "Resident",
        at: days(4),
        text: "It got worse after last night's rain. The hole is now almost a meter wide.",
      },
      {
        id: "c2",
        author: "Beirut Municipality",
        role: "Authority",
        at: days(2),
        text: "Repair crew scheduled for tomorrow 8am. Expect brief lane closure on Rue Bliss.",
      },
    ],
  },
  {
    id: "ISS-1041",
    title: "Street light out on Gouraud Street for 10 days",
    description:
      "The streetlight at the corner of Gouraud and Sursock Street has been completely dark for over a week. Very dangerous at night.",
    category: "Lighting",
    neighborhood: "Achrafieh",
    address: "Gouraud St & Sursock St",
    status: "Acknowledged",
    reporter: "Rami Assaf",
    createdAt: days(4),
    upvotes: 18,
    aiRoutingNote:
      "This looks like a street lighting issue — likely handled by Électricité du Liban or the municipality.",
    log: [
      { status: "Reported", at: days(4), by: "Rami Assaf" },
      { status: "Acknowledged", at: days(3), by: "EDL Achrafieh Office" },
    ],
    comments: [],
  },
  {
    id: "ISS-1040",
    title: "Overflowing dumpsters on Armenia Street",
    description:
      "Three dumpsters near the entrance of Bourj Hammoud market have been overflowing since Thursday. The smell is unbearable and attracting rats.",
    category: "Sanitation",
    neighborhood: "Bourj Hammoud",
    address: "Armenia Street, near municipal market",
    status: "Resolved",
    reporter: "Silva Parseghian",
    createdAt: days(8),
    upvotes: 42,
    aiRoutingNote:
      "This appears to be a waste collection issue — typically handled by Sukleen or the local municipality.",
    log: [
      { status: "Reported", at: days(8), by: "Silva Parseghian" },
      { status: "Acknowledged", at: days(7), by: "Bourj Hammoud Municipality" },
      { status: "In Progress", at: days(6), by: "Bourj Hammoud Municipality" },
      {
        status: "Resolved",
        at: days(5),
        by: "Bourj Hammoud Municipality",
        note: "Dumpsters emptied, extra pickup added for weekends.",
      },
    ],
    comments: [
      {
        id: "c3",
        author: "Bourj Hammoud Municipality",
        role: "Authority",
        at: days(5),
        text: "Resolved — we've added a recurring Saturday pickup for this area.",
      },
    ],
  },
  {
    id: "ISS-1039",
    title: "Construction noise past midnight on Verdun Street",
    description:
      "The new building project on Verdun Street near Le Mall has been running generators and drilling every night past midnight. Residents can't sleep.",
    category: "Noise",
    neighborhood: "Verdun",
    address: "Verdun Street, near Le Mall Beirut",
    status: "Reported",
    reporter: "Hana Mroueh",
    createdAt: days(1),
    upvotes: 11,
    aiRoutingNote:
      "This looks like a noise ordinance issue — likely reviewed by the municipality's code enforcement.",
    log: [{ status: "Reported", at: days(1), by: "Hana Mroueh" }],
    comments: [],
  },
  {
    id: "ISS-1038",
    title: "Broken bench and damaged path at Horsh Dekwaneh",
    description:
      "Two benches near the main entrance of Horsh Dekwaneh are broken. The walking path next to them has cracked tiles that are a tripping hazard.",
    category: "Parks",
    neighborhood: "Dekwaneh",
    address: "Horsh Dekwaneh, main entrance",
    status: "Acknowledged",
    reporter: "Georges Khoury",
    createdAt: days(3),
    upvotes: 22,
    aiRoutingNote:
      "This appears to be a parks maintenance issue — likely routed to parks & recreation.",
    log: [
      { status: "Reported", at: days(3), by: "Georges Khoury" },
      { status: "Acknowledged", at: days(2), by: "Dekwaneh Municipality" },
    ],
    comments: [],
  },
  {
    id: "ISS-1037",
    title: "Burst water pipe flooding main road in Tyre",
    description:
      "A water pipe has been leaking for 4 days on the main road near Tyre corniche. The entire street is flooded and cars are avoiding the area.",
    category: "Utilities",
    neighborhood: "Tyre",
    address: "Tyre Corniche, near the fishing port",
    status: "In Progress",
    reporter: "Ali Bazzi",
    createdAt: days(5),
    upvotes: 27,
    aiRoutingNote:
      "This looks like a water main issue — typically handled by the Water Authority (Litani River Authority).",
    log: [
      { status: "Reported", at: days(5), by: "Ali Bazzi" },
      { status: "Acknowledged", at: days(4), by: "Litani River Authority" },
      {
        status: "In Progress",
        at: days(2),
        by: "Litani River Authority",
        note: "Excavation crew on site, pipe repair in progress.",
      },
    ],
    comments: [],
  },
];

export const STATUS_FLOW: Status[] = [
  "Reported",
  "Acknowledged",
  "In Progress",
  "Resolved",
];

export function statusColor(s: Status) {
  switch (s) {
    case "Reported":
      return "bg-status-reported/15 text-status-reported border-status-reported/30";
    case "Acknowledged":
      return "bg-status-acknowledged/15 text-status-acknowledged border-status-acknowledged/30";
    case "In Progress":
      return "bg-status-progress/15 text-status-progress border-status-progress/30";
    case "Resolved":
      return "bg-status-resolved/15 text-status-resolved border-status-resolved/30";
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
  if (/pothole|road|pavement|asphalt|crack|طريق/.test(t))
    return {
      category: "Roads",
      note: "Looks like a road surface issue — likely handled by the municipality's public works department.",
    };
  if (/light|lamp|dark|streetlight|كهرباء/.test(t))
    return {
      category: "Lighting",
      note: "This looks like a street lighting issue — likely handled by EDL or the municipality.",
    };
  if (/water|leak|pipe|sewer|مياه/.test(t))
    return {
      category: "Utilities",
      note: "This looks like a utilities issue — typically handled by the Water Authority.",
    };
  if (/trash|garbage|bin|litter|dumpster|نفايات/.test(t))
    return {
      category: "Sanitation",
      note: "This appears to be a waste collection issue — typically handled by Sukleen or the municipality.",
    };
  if (/park|bench|tree|path|حديقة/.test(t))
    return {
      category: "Parks",
      note: "This appears to be a parks maintenance issue — likely routed to parks & recreation.",
    };
  if (/noise|loud|generator|construction|ضجيج/.test(t))
    return {
      category: "Noise",
      note: "This looks like a noise ordinance issue — likely reviewed by code enforcement.",
    };
  if (/unsafe|crime|hazard|danger|أمان/.test(t))
    return {
      category: "Safety",
      note: "This looks like a public safety concern — likely routed to community safety.",
    };
  return {
    category: "Roads",
    note: "Couldn't confidently classify — please confirm the best category.",
  };
}
