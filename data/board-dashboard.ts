export type BoardMetric = {
  id: string;
  label: string;
  value: number;
  max: number;
  suffix?: string;
  trend: string;
};

export type ProjectHeatItem = {
  project: string;
  vertical: string;
  status: string;
  budgetGmd: number;
  progress: number;
  risk: "ON_TRACK" | "AT_RISK" | "CRITICAL";
  owner: string;
};

export type AlertItem = {
  id: string;
  type: "deadline" | "prospect" | "mou" | "idea";
  message: string;
  tone: "red" | "gold" | "amber" | "teal";
};

export const boardMetrics: BoardMetric[] = [
  { id: "projects", label: "Active Projects", value: 6, max: 10, trend: "+2 this quarter" },
  { id: "energy", label: "Energy Units Deployed", value: 42, max: 100, trend: "+18 this month" },
  { id: "grants", label: "Grant Pipeline Value", value: 3.4, max: 5, suffix: "M USD", trend: "4 high-fit grants" },
  { id: "prospects", label: "SME Prospects Scored", value: 76, max: 100, trend: "+19 this week" },
  { id: "mous", label: "Partner MOUs Active", value: 4, max: 8, trend: "2 under review" },
  { id: "sprint", label: "90-Day Sprint Progress", value: 31, max: 100, suffix: "%", trend: "On schedule" },
];

export const projectHeatMap: ProjectHeatItem[] = [
  { project: "Bug Factory Pilot", vertical: "Agriculture", status: "Mobilisation", budgetGmd: 32000000, progress: 46, risk: "AT_RISK", owner: "Cadjatu Djalo" },
  { project: "Smart Battery Pack Rollout", vertical: "Energy", status: "Pilot hubs", budgetGmd: 28500000, progress: 54, risk: "ON_TRACK", owner: "Operations Manager" },
  { project: "SME SaaS Cohort 1", vertical: "SaaS", status: "Acquisition", budgetGmd: 6200000, progress: 38, risk: "ON_TRACK", owner: "Growth Lead" },
  { project: "Fortis Command Centre", vertical: "Infrastructure", status: "Sponsor search", budgetGmd: 8400000, progress: 24, risk: "AT_RISK", owner: "Cadjatu Djalo" },
  { project: "Government Alignment Track", vertical: "Public Sector", status: "MOU pipeline", budgetGmd: 1900000, progress: 61, risk: "ON_TRACK", owner: "Samba Bajie" },
  { project: "Investor Roadshow", vertical: "Finance", status: "Preparation", budgetGmd: 2700000, progress: 20, risk: "CRITICAL", owner: "Investor Relations" },
];

export const boardAlerts: AlertItem[] = [
  { id: "a1", type: "deadline", message: "AfDB submission window closes in 14 days.", tone: "red" },
  { id: "a2", type: "prospect", message: "3 SME prospects scored above 80% this week.", tone: "gold" },
  { id: "a3", type: "mou", message: "One partner MOU renewal due in 30 days.", tone: "amber" },
  { id: "a4", type: "idea", message: "Two new community ideas submitted for energy hubs.", tone: "teal" },
];

export const personalBriefing = {
  pendingSignoffs: [
    "Approve Bug Factory pilot budget line items",
    "Confirm investor call deck version 1.2",
    "Review Ecobank sponsor outreach letter",
  ],
  flaggedEmails: [
    "DFI introduction from Portugal network",
    "Agriculture equipment supplier follow-up",
  ],
  meetings: [
    "Thursday 10:00 GMT - Technical partner screening",
    "Friday 14:00 GMT - Grant readiness review",
  ],
};
