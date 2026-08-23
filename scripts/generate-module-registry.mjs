import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function routeFor(file, marker) {
  const base = relative(join(root, "app"), file).replaceAll("\\", "/");
  const suffix = marker === "page" ? "/page.tsx" : "/route.ts";
  const raw = `/${base.slice(0, -suffix.length)}`.replace("/page.tsx", "/");
  return raw === "" ? "/" : raw;
}

function appletFor(value) {
  const s = value.toLowerCase();
  if (/training|learning|certificate|employer/.test(s)) return "academy";
  if (/ujris|legal|evidence|court-order|compliance|cybersecurity\/ciip/.test(s)) return "govern";
  if (/marketplace|seller|car-hire|owner\/escrow|equipment-hire|logistics|professionals|brands|chi-engine|unified-inbox|settings\/platforms|ikenga/.test(s)) return "partner";
  if (/discover|tourism|festival|gambian-culture|embass|education|emergency|government|media|professional-bodies|unions|cooperatives|villages|airport|ports-ferries|tango|heritage/.test(s)) return "discover";
  if (/uju|funding|grant|investor|financial|fintech|agriculture|livestock|soil|energy|waste|gbos|census|national-stats|website-builder|tax-import|housing|health/.test(s)) return "grow";
  return "core";
}

const blocked = new Set([
  "/api/verify-payment", "/api/subscriptions", "/api/marketplace/checkout",
  "/api/marketplace/currency-rates", "/api/ikenga/deep-search", "/api/evidence/process",
  "/api/documents/draft", "/api/presentation/generate", "/api/audio/summarize",
  "/api/audio/summary", "/api/translate", "/api/training/generate-course",
  "/api/ikenga/generate-logo", "/api/admin/content-fetch", "/api/v2/credit-score",
  "/api/marketplace/currency-exchange", "/api/seller/deposit", "/api/car-hire/bookings",
  "/api/car-hire/escrow", "/api/car-hire/claims", "/api/car-hire/vehicles",
  "/api/marketplace/dispute", "/api/marketplace/dispute/[id]/resolve",
  "/api/marketplace/order/[id]/confirm-delivery", "/api/marketplace/order/[id]/confirm-location",
  "/employers/dashboard", "/owner/escrow-dashboard", "/admin/training-hub",
  "/admin/super", "/admin/escalations",
]);

const mockPattern = /\b(mock|always_approve|simulateProcess|simulateSearch|placeholder response|placeholder output|hard-coded)\b/i;
const moneyPattern = /payment|checkout|subscription|escrow|payout|refund|commission|billing|deposit|order/i;
const sensitivePattern = /legal|court|evidence|pii|password|auth|credential|kyc|claim|admin/i;

function classify(file, route) {
  const source = readFileSync(file, "utf8");
  const findings = [];
  if (mockPattern.test(source)) findings.push("mock-or-placeholder-indicator");
  if (moneyPattern.test(`${route} ${source.slice(0, 3000)}`)) findings.push("financial-domain");
  if (sensitivePattern.test(`${route} ${source.slice(0, 3000)}`)) findings.push("sensitive-domain");
  const blockedInProduction = blocked.has(route);
  return {
    maturity: blockedInProduction ? "internal" : "preview",
    decision: blockedInProduction || findings.includes("mock-or-placeholder-indicator") ? "rebuild-or-integrate" : "retain-and-audit",
    blockedInProduction,
    findings,
  };
}

const appFiles = walk(join(root, "app"));
const pages = appFiles.filter((p) => p.endsWith("/page.tsx")).map((file) => {
  const route = routeFor(file, "page");
  return { type: "page", path: relative(root, file), route, applet: appletFor(route), ...classify(file, route) };
});
const apis = appFiles.filter((p) => p.endsWith("/route.ts")).map((file) => {
  const route = routeFor(file, "api");
  const source = readFileSync(file, "utf8");
  const methods = [...source.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g)].map((m) => m[1]);
  return { type: "api", path: relative(root, file), route, methods, applet: appletFor(route), ...classify(file, route) };
});

const schema = readFileSync(join(root, "prisma/schema.prisma"), "utf8");
const models = [...schema.matchAll(/^model\s+(\w+)\s*\{/gm)].map((match) => ({
  type: "model",
  name: match[1],
  path: "prisma/schema.prisma",
  applet: appletFor(match[1]),
  maturity: "preview",
  decision: "retain-and-audit",
}));

const datasets = walk(join(root, "data")).filter((p) => statSync(p).isFile()).map((file) => ({
  type: "dataset",
  path: relative(root, file),
  applet: appletFor(file),
  maturity: "preview",
  decision: "verify-source-licence-freshness",
}));

const jobs = apis.filter((asset) => asset.route.startsWith("/api/cron/"));
const assets = [...pages, ...apis, ...models, ...datasets];
const byApplet = Object.fromEntries(["core", "grow", "govern", "discover", "academy", "partner"].map((applet) => [
  applet,
  assets.filter((a) => a.applet === applet).length,
]));

const registry = {
  schemaVersion: 1,
  policy: {
    publicMaturityLabels: ["internal", "preview", "pilot", "production"],
    note: "No asset is classified production until launch-gate evidence is linked. Preview does not permit simulated financial or official-data success.",
  },
  summary: {
    pages: pages.length,
    apis: apis.length,
    models: models.length,
    datasets: datasets.length,
    scheduledJobs: jobs.length,
    blockedInProduction: assets.filter((a) => a.blockedInProduction).length,
    byApplet,
  },
  assets,
};

const destination = join(root, "docs/phase-0/module-registry.json");
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Generated ${relative(root, destination)} with ${assets.length} assets.`);
