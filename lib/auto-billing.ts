import { getUsageStats } from "@/lib/openai-client";
import { escalateToHuman } from "@/lib/notifications/alert";

export type BillingProvider =
  | "vercel"
  | "openai"
  | "google"
  | "resend"
  | "supabase"
  | "neon";

export type BillingStatus = "healthy" | "degraded" | "critical";
export type BillingSource = "live" | "env" | "default";

export interface BillingServiceMetric {
  name: string;
  provider: BillingProvider;
  status: BillingStatus;
  usage: number;
  limit: number;
  unit: string;
  percentage: number;
  alertThreshold: number;
  criticalThreshold: number;
  billingCycle: string;
  nextBillingDate: string;
  autoBillingEnabled: boolean;
  maxAutoChargeUsd: number;
  estimatedChargeUsd: number;
  source: BillingSource;
  notes: string[];
}

export interface BillingAlert {
  service: string;
  provider: BillingProvider;
  status: Exclude<BillingStatus, "healthy">;
  percentage: number;
  estimatedChargeUsd: number;
  usage: number;
  limit: number;
  unit: string;
}

export interface BillingSnapshot {
  generatedAt: string;
  overallStatus: BillingStatus;
  totalEstimatedChargeUsd: number;
  nextBillingDate: string;
  services: BillingServiceMetric[];
  alerts: {
    degraded: BillingAlert[];
    critical: BillingAlert[];
  };
}

interface SystemSummary {
  healthScore: number;
  summary: string;
}

interface ServiceDefaults {
  name: string;
  provider: BillingProvider;
  unit: string;
  usageKey?: string;
  limitKey?: string;
  thresholdKey?: string;
  criticalThresholdKey?: string;
  autoBillingKey?: string;
  maxAutoChargeKey?: string;
  upgradeCostKey?: string;
  overageRateKey?: string;
  defaultUsage: number;
  defaultLimit: number;
  defaultAlertThreshold: number;
  defaultCriticalThreshold: number;
  defaultAutoBillingEnabled: boolean;
  defaultMaxAutoChargeUsd: number;
  defaultUpgradeCostUsd?: number;
  defaultOverageRateUsd?: number;
  usageResolver?: () => Promise<number> | number;
}

const SERVICE_DEFAULTS: ServiceDefaults[] = [
  {
    name: "Vercel",
    provider: "vercel",
    unit: "GB",
    usageKey: "VERCEL_BANDWIDTH_USAGE_GB",
    limitKey: "VERCEL_BANDWIDTH_LIMIT_GB",
    thresholdKey: "VERCEL_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "VERCEL_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "VERCEL_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "VERCEL_MAX_AUTO_CHARGE_USD",
    upgradeCostKey: "VERCEL_MONTHLY_PLAN_USD",
    overageRateKey: "VERCEL_OVERAGE_RATE_USD_PER_GB",
    defaultUsage: 0,
    defaultLimit: 100,
    defaultAlertThreshold: 80,
    defaultCriticalThreshold: 90,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 20,
    defaultUpgradeCostUsd: 20,
    defaultOverageRateUsd: 0.2,
  },
  {
    name: "Supabase",
    provider: "supabase",
    unit: "MB",
    usageKey: "SUPABASE_DB_USAGE_MB",
    limitKey: "SUPABASE_DB_LIMIT_MB",
    thresholdKey: "SUPABASE_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "SUPABASE_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "SUPABASE_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "SUPABASE_MAX_AUTO_CHARGE_USD",
    upgradeCostKey: "SUPABASE_MONTHLY_PLAN_USD",
    defaultUsage: 0,
    defaultLimit: 500,
    defaultAlertThreshold: 75,
    defaultCriticalThreshold: 90,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 25,
    defaultUpgradeCostUsd: 25,
  },
  {
    name: "Neon",
    provider: "neon",
    unit: "MB",
    usageKey: "NEON_STORAGE_USAGE_MB",
    limitKey: "NEON_STORAGE_LIMIT_MB",
    thresholdKey: "NEON_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "NEON_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "NEON_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "NEON_MAX_AUTO_CHARGE_USD",
    upgradeCostKey: "NEON_MONTHLY_PLAN_USD",
    defaultUsage: 0,
    defaultLimit: 1024,
    defaultAlertThreshold: 80,
    defaultCriticalThreshold: 90,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 19,
    defaultUpgradeCostUsd: 19,
  },
  {
    name: "Resend",
    provider: "resend",
    unit: "emails",
    usageKey: "RESEND_EMAILS_SENT",
    limitKey: "RESEND_EMAILS_LIMIT",
    thresholdKey: "RESEND_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "RESEND_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "RESEND_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "RESEND_MAX_AUTO_CHARGE_USD",
    upgradeCostKey: "RESEND_MONTHLY_PLAN_USD",
    overageRateKey: "RESEND_OVERAGE_RATE_USD_PER_EMAIL",
    defaultUsage: 0,
    defaultLimit: 3000,
    defaultAlertThreshold: 83.33,
    defaultCriticalThreshold: 95,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 0,
    defaultUpgradeCostUsd: 0,
    defaultOverageRateUsd: 0,
  },
  {
    name: "OpenAI",
    provider: "openai",
    unit: "USD",
    limitKey: "OPENAI_MONTHLY_BUDGET_USD",
    thresholdKey: "OPENAI_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "OPENAI_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "OPENAI_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "OPENAI_MAX_AUTO_CHARGE_USD",
    defaultUsage: 0,
    defaultLimit: 500,
    defaultAlertThreshold: 80,
    defaultCriticalThreshold: 90,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 100,
    usageResolver: () => getUsageStats().totalCostUSD,
  },
  {
    name: "Google Maps",
    provider: "google",
    unit: "USD",
    usageKey: "GOOGLE_MAPS_USAGE_USD",
    limitKey: "GOOGLE_MAPS_CREDIT_USD",
    thresholdKey: "GOOGLE_MAPS_ALERT_THRESHOLD_PCT",
    criticalThresholdKey: "GOOGLE_MAPS_CRITICAL_THRESHOLD_PCT",
    autoBillingKey: "GOOGLE_MAPS_AUTO_BILLING_ENABLED",
    maxAutoChargeKey: "GOOGLE_MAPS_MAX_AUTO_CHARGE_USD",
    overageRateKey: "GOOGLE_MAPS_OVERAGE_RATE_USD_PER_UNIT",
    defaultUsage: 0,
    defaultLimit: 200,
    defaultAlertThreshold: 80,
    defaultCriticalThreshold: 90,
    defaultAutoBillingEnabled: true,
    defaultMaxAutoChargeUsd: 50,
    defaultOverageRateUsd: 1,
  },
];

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function splitCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNextBillingDate(): string {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + 1, 1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0];
}

function getStatus(percentage: number, alertThreshold: number, criticalThreshold: number): BillingStatus {
  if (percentage >= criticalThreshold) {
    return "critical";
  }
  if (percentage >= alertThreshold) {
    return "degraded";
  }
  return "healthy";
}

function getEstimatedChargeUsd(args: {
  usage: number;
  limit: number;
  overageRateUsd?: number;
  upgradeCostUsd?: number;
}): number {
  const overageUnits = Math.max(0, args.usage - args.limit);
  if (overageUnits <= 0) {
    return 0;
  }

  if ((args.upgradeCostUsd ?? 0) > 0) {
    return Number(args.upgradeCostUsd?.toFixed(2) ?? "0");
  }

  return Number((overageUnits * (args.overageRateUsd ?? 0)).toFixed(2));
}

function getDefaultNotes(service: ServiceDefaults, source: BillingSource, hasUsageOverride: boolean): string[] {
  const notes: string[] = [];

  if (service.provider === "openai") {
    notes.push("Usage is derived from the in-process OpenAI token tracker.");
  } else if (source === "env" && service.usageKey) {
    notes.push(`Usage is sourced from env var ${service.usageKey}.`);
  } else if (source === "default" && service.usageKey) {
    notes.push(`Set ${service.usageKey} to replace the default usage value of ${service.defaultUsage}.`);
  }

  if (!hasUsageOverride && service.provider !== "openai") {
    notes.push("Provider APIs are not wired yet, so this metric is configuration-driven.");
  }

  return notes;
}

async function buildServiceMetric(service: ServiceDefaults): Promise<BillingServiceMetric> {
  const usageFromResolver = service.usageResolver ? await service.usageResolver() : undefined;
  const usageFromEnv = service.usageKey ? process.env[service.usageKey] : undefined;
  const limitFromEnv = service.limitKey ? process.env[service.limitKey] : undefined;
  const thresholdFromEnv = service.thresholdKey ? process.env[service.thresholdKey] : undefined;
  const criticalThresholdFromEnv = service.criticalThresholdKey ? process.env[service.criticalThresholdKey] : undefined;
  const autoBillingFromEnv = service.autoBillingKey ? process.env[service.autoBillingKey] : undefined;
  const maxAutoChargeFromEnv = service.maxAutoChargeKey ? process.env[service.maxAutoChargeKey] : undefined;
  const upgradeCostFromEnv = service.upgradeCostKey ? process.env[service.upgradeCostKey] : undefined;
  const overageRateFromEnv = service.overageRateKey ? process.env[service.overageRateKey] : undefined;

  const usage =
    usageFromResolver !== undefined
      ? usageFromResolver
      : usageFromEnv !== undefined
        ? parseNumber(usageFromEnv, service.defaultUsage)
        : service.defaultUsage;

  const limit = parseNumber(limitFromEnv, service.defaultLimit);
  const alertThreshold = parseNumber(thresholdFromEnv, service.defaultAlertThreshold);
  const criticalThreshold = parseNumber(criticalThresholdFromEnv, service.defaultCriticalThreshold);
  const percentage = limit > 0 ? Number(((usage / limit) * 100).toFixed(2)) : 0;
  const source: BillingSource =
    usageFromResolver !== undefined ? "live" : usageFromEnv !== undefined ? "env" : "default";
  const autoBillingEnabled = parseBoolean(autoBillingFromEnv, service.defaultAutoBillingEnabled);
  const maxAutoChargeUsd = parseNumber(maxAutoChargeFromEnv, service.defaultMaxAutoChargeUsd);
  const estimatedChargeUsd = getEstimatedChargeUsd({
    usage,
    limit,
    overageRateUsd: parseNumber(overageRateFromEnv, service.defaultOverageRateUsd ?? 0),
    upgradeCostUsd: parseNumber(upgradeCostFromEnv, service.defaultUpgradeCostUsd ?? 0),
  });

  const notes = getDefaultNotes(service, source, usageFromEnv !== undefined);

  if (percentage >= alertThreshold) {
    notes.push(
      percentage >= criticalThreshold
        ? "Critical threshold reached. Review plan limits immediately."
        : "Alert threshold reached. Monitor usage closely before the next billing cycle."
    );
  }

  if (estimatedChargeUsd > 0) {
    notes.push(`Estimated incremental charge is ${formatCurrency(estimatedChargeUsd)}.`);
  } else if (percentage > 100) {
    notes.push("Pricing is not fully configured for this service, so overage may require manual review.");
  }

  if (autoBillingEnabled) {
    notes.push(
      estimatedChargeUsd > maxAutoChargeUsd && estimatedChargeUsd > 0
        ? `Estimated charge exceeds the automation cap of ${formatCurrency(maxAutoChargeUsd)} and requires approval.`
        : "Alert automation is enabled for this service."
    );
  } else {
    notes.push("Auto-billing workflow is disabled for this service.");
  }

  return {
    name: service.name,
    provider: service.provider,
    status: getStatus(percentage, alertThreshold, criticalThreshold),
    usage: Number(usage.toFixed(2)),
    limit: Number(limit.toFixed(2)),
    unit: service.unit,
    percentage,
    alertThreshold,
    criticalThreshold,
    billingCycle: "Monthly",
    nextBillingDate: getNextBillingDate(),
    autoBillingEnabled,
    maxAutoChargeUsd,
    estimatedChargeUsd,
    source,
    notes,
  };
}

export async function getBillingSnapshot(): Promise<BillingSnapshot> {
  const services = await Promise.all(SERVICE_DEFAULTS.map(buildServiceMetric));
  const critical = services
    .filter((service) => service.status === "critical")
    .map(toBillingAlert);
  const degraded = services
    .filter((service) => service.status === "degraded")
    .map(toBillingAlert);
  const overallStatus: BillingStatus =
    critical.length > 0 ? "critical" : degraded.length > 0 ? "degraded" : "healthy";

  return {
    generatedAt: new Date().toISOString(),
    overallStatus,
    totalEstimatedChargeUsd: Number(
      services.reduce((sum, service) => sum + service.estimatedChargeUsd, 0).toFixed(2)
    ),
    nextBillingDate: getNextBillingDate(),
    services,
    alerts: {
      degraded,
      critical,
    },
  };
}

function toBillingAlert(service: BillingServiceMetric): BillingAlert {
  return {
    service: service.name,
    provider: service.provider,
    status: service.status as Exclude<BillingStatus, "healthy">,
    percentage: service.percentage,
    estimatedChargeUsd: service.estimatedChargeUsd,
    usage: service.usage,
    limit: service.limit,
    unit: service.unit,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getNotificationRecipients(): string[] {
  const configured = splitCsv(process.env.BILLING_ALERT_EMAILS);
  if (configured.length > 0) {
    return configured;
  }

  const fallback = splitCsv(process.env.ADMIN_EMAIL);
  if (fallback.length > 0) {
    return fallback;
  }

  return ["ceo@fortisos.gm"];
}

async function sendResendEmail(args: {
  subject: string;
  html: string;
  to?: string[];
}): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.BILLING_FROM_EMAIL ?? "FORTIS OS Billing <billing@fortisos.cloud>",
        to: args.to ?? getNotificationRecipients(),
        subject: args.subject,
        html: args.html,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function buildAlertHtml(snapshot: BillingSnapshot): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#0f172a">
      <h2 style="margin-bottom:8px">FORTIS OS billing alert</h2>
      <p style="margin-top:0;color:#475569">
        Generated at ${snapshot.generatedAt}. Overall status: <strong>${snapshot.overallStatus.toUpperCase()}</strong>.
      </p>
      ${renderAlertList("Critical services", snapshot.alerts.critical, "#dc2626")}
      ${renderAlertList("Watch services", snapshot.alerts.degraded, "#d97706")}
      <p style="color:#475569">
        Estimated incremental charges: <strong>${formatCurrency(snapshot.totalEstimatedChargeUsd)}</strong><br />
        Next billing date: <strong>${snapshot.nextBillingDate}</strong>
      </p>
      <p style="margin-bottom:0">
        Review the billing dashboard at <a href="https://fortisos.cloud/admin/billing">/admin/billing</a>.
      </p>
    </div>
  `;
}

function renderAlertList(title: string, alerts: BillingAlert[], accent: string): string {
  if (alerts.length === 0) {
    return "";
  }

  const items = alerts
    .map(
      (alert) => `
        <li style="margin-bottom:8px">
          <strong>${alert.service}</strong>: ${alert.percentage.toFixed(1)}% of limit
          (${alert.usage.toFixed(2)} / ${alert.limit.toFixed(2)} ${alert.unit})
          ${alert.estimatedChargeUsd > 0 ? `- est. ${formatCurrency(alert.estimatedChargeUsd)}` : ""}
        </li>
      `
    )
    .join("");

  return `
    <div style="border-left:4px solid ${accent};padding-left:16px;margin:20px 0">
      <h3 style="margin:0 0 10px;color:${accent}">${title}</h3>
      <ul style="padding-left:18px;margin:0">${items}</ul>
    </div>
  `;
}

export async function checkAndNotifyBilling(source = "Daily billing protocol"): Promise<BillingSnapshot> {
  const snapshot = await getBillingSnapshot();
  const alertCount = snapshot.alerts.critical.length + snapshot.alerts.degraded.length;

  if (alertCount === 0) {
    return snapshot;
  }

  await sendResendEmail({
    subject: `FORTIS OS billing alert - ${snapshot.overallStatus.toUpperCase()}`,
    html: buildAlertHtml(snapshot),
  });

  const topAlerts = [...snapshot.alerts.critical, ...snapshot.alerts.degraded]
    .map((alert) => `${alert.service}: ${alert.percentage.toFixed(1)}%`)
    .join(", ");

  await escalateToHuman({
    issue: "Billing threshold exceeded",
    detail: `${alertCount} service(s) crossed their billing threshold: ${topAlerts}`,
    attemptedFix: "Generated billing snapshot and sent alert email.",
    instructions:
      "Review /admin/billing, verify current provider usage, and approve any charge above the configured automation cap before the next billing cycle.",
    priority: snapshot.alerts.critical.length > 0 ? "critical" : "high",
    source,
  });

  return snapshot;
}

export async function sendDailyBillingSummaryEmail(
  snapshot: BillingSnapshot,
  systemSummary?: SystemSummary
): Promise<boolean> {
  const serviceRows = snapshot.services
    .map(
      (service) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${service.name}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${service.percentage.toFixed(1)}%</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${service.usage.toFixed(2)} / ${service.limit.toFixed(2)} ${service.unit}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${formatCurrency(service.estimatedChargeUsd)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${service.status}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#0f172a">
      <h2 style="margin-bottom:6px">FORTIS OS daily diagnostics summary</h2>
      <p style="margin-top:0;color:#475569">
        Billing status: <strong>${snapshot.overallStatus.toUpperCase()}</strong><br />
        Estimated incremental charges: <strong>${formatCurrency(snapshot.totalEstimatedChargeUsd)}</strong><br />
        Next billing date: <strong>${snapshot.nextBillingDate}</strong>
      </p>
      ${
        systemSummary
          ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:18px 0">
              <div style="font-weight:700;margin-bottom:4px">System diagnostics</div>
              <div>Health score: <strong>${systemSummary.healthScore}%</strong></div>
              <div style="color:#475569;margin-top:4px">${systemSummary.summary}</div>
            </div>`
          : ""
      }
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:#f8fafc;text-align:left">
            <th style="padding:8px 10px;border-bottom:1px solid #cbd5e1">Service</th>
            <th style="padding:8px 10px;border-bottom:1px solid #cbd5e1">Usage</th>
            <th style="padding:8px 10px;border-bottom:1px solid #cbd5e1">Current</th>
            <th style="padding:8px 10px;border-bottom:1px solid #cbd5e1">Est. charge</th>
            <th style="padding:8px 10px;border-bottom:1px solid #cbd5e1">Status</th>
          </tr>
        </thead>
        <tbody>${serviceRows}</tbody>
      </table>
      <p style="margin-top:18px">
        Dashboard: <a href="https://fortisos.cloud/admin/billing">/admin/billing</a>
      </p>
    </div>
  `;

  return await sendResendEmail({
    subject: `FORTIS OS daily diagnostics - ${snapshot.generatedAt.split("T")[0]}`,
    html,
  });
}
