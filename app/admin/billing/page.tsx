"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DARK = "#0A2E1A";
const GREEN = "#1B4D3E";
const GOLD = "#C4943A";
const BG = "#F3F6F1";

type BillingStatus = "healthy" | "degraded" | "critical";

interface BillingServiceMetric {
  name: string;
  provider: string;
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
  source: "live" | "env" | "default";
  notes: string[];
}

interface BillingAlert {
  service: string;
  status: "degraded" | "critical";
  percentage: number;
  estimatedChargeUsd: number;
  usage: number;
  limit: number;
  unit: string;
}

interface BillingSnapshot {
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

interface BillingResponse {
  timestamp: string;
  healthScore: number;
  overallStatus: string;
  billing: BillingSnapshot | null;
  access?: {
    billing?: boolean;
  };
  recommendations: string[];
}

function isAuthorisedRole(role?: string) {
  return ["SUPER_ADMIN", "CEO", "BOARD"].includes(role ?? "");
}

function getStatusColor(status: BillingStatus) {
  if (status === "critical") return "#DC2626";
  if (status === "degraded") return "#D97706";
  return "#16A34A";
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BillingDashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAuthorised = status === "authenticated" && isAuthorisedRole(role);

  useEffect(() => {
    if (!isAuthorised) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadBilling() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/diagnostics/unified?scope=billing", {
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Failed to fetch billing diagnostics.");
        }

        const payload = (await response.json()) as BillingResponse;
        if (!cancelled) {
          setData(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch billing diagnostics.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBilling();
    const interval = window.setInterval(loadBilling, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isAuthorised]);

  if (status === "loading") {
    return <FullPageMessage title="Checking access" detail="Verifying your FORTIS OS session." />;
  }

  if (!isAuthorised) {
    return (
      <FullPageMessage
        title="Restricted Access"
        detail="This dashboard is available to SUPER_ADMIN, CEO, and BOARD users through the authenticated FORTIS OS portal."
        actionLabel="Sign In"
        actionHref="/auth/login"
      />
    );
  }

  const billing = data?.billing;
  const totalAlerts = (billing?.alerts.critical.length ?? 0) + (billing?.alerts.degraded.length ?? 0);

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${GREEN} 60%, #2A6B52 100%)`, color: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <Link href="/admin/diagnostics" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: 13 }}>
                Back to diagnostics
              </Link>
              <h1 style={{ margin: "10px 0 6px", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 900 }}>
                Billing and Usage Control
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", maxWidth: 760, lineHeight: 1.6, fontSize: 14 }}>
                Live billing posture for Vercel, Supabase, Neon, Resend, OpenAI, and Google Maps, with threshold alerts and automation caps.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/admin/dashboard" style={headerLinkStyle(false)}>
                Admin dashboard
              </Link>
              <Link href="/admin/diagnostics" style={headerLinkStyle(true)}>
                Diagnostics
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 20px 48px" }}>
        {error && <div style={errorStyle}>{error}</div>}

        <div style={summaryGridStyle}>
          <SummaryCard
            label="Billing posture"
            value={billing ? billing.overallStatus.toUpperCase() : loading ? "Loading" : "Unavailable"}
            accent={billing ? getStatusColor(billing.overallStatus) : GOLD}
            meta={billing ? `Last refresh: ${new Date(billing.generatedAt).toLocaleString()}` : "Awaiting data"}
          />
          <SummaryCard
            label="Estimated incremental charges"
            value={billing ? formatCurrency(billing.totalEstimatedChargeUsd) : "$0.00"}
            accent={billing && billing.totalEstimatedChargeUsd > 0 ? "#D97706" : "#16A34A"}
            meta={billing ? `Next billing date: ${billing.nextBillingDate}` : "No billing snapshot yet"}
          />
          <SummaryCard
            label="Services on alert"
            value={loading ? "..." : String(totalAlerts)}
            accent={totalAlerts > 0 ? "#D97706" : "#16A34A"}
            meta={billing ? `${billing.alerts.critical.length} critical, ${billing.alerts.degraded.length} watch` : "No active alerts"}
          />
          <SummaryCard
            label="Platform health score"
            value={data ? `${data.healthScore}%` : "..."}
            accent={data && data.healthScore < 70 ? "#DC2626" : data && data.healthScore < 90 ? "#D97706" : "#16A34A"}
            meta={data ? `System status: ${data.overallStatus}` : "Unified diagnostics unavailable"}
          />
        </div>

        {loading && !billing ? (
          <div style={cardStyle}>Loading billing diagnostics...</div>
        ) : billing ? (
          <>
            {totalAlerts > 0 && (
              <section style={{ ...cardStyle, borderLeft: `4px solid ${billing.alerts.critical.length > 0 ? "#DC2626" : GOLD}` }}>
                <h2 style={sectionTitleStyle}>Action Queue</h2>
                <p style={{ margin: "0 0 16px", color: "#475569", lineHeight: 1.6 }}>
                  These services have crossed their configured thresholds and should be reviewed before the next billing cycle.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                  {[...billing.alerts.critical, ...billing.alerts.degraded].map((alert) => (
                    <div key={`${alert.service}-${alert.status}`} style={alertCardStyle(alert.status)}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <strong style={{ color: DARK }}>{alert.service}</strong>
                        <span style={pillStyle(alert.status)}>{alert.status.toUpperCase()}</span>
                      </div>
                      <p style={{ margin: "10px 0 6px", color: "#475569", fontSize: 13 }}>
                        {alert.percentage.toFixed(1)}% of limit used
                      </p>
                      <p style={{ margin: "0 0 6px", color: "#0f172a", fontSize: 13 }}>
                        {alert.usage.toFixed(2)} / {alert.limit.toFixed(2)} {alert.unit}
                      </p>
                      <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
                        Estimated charge: <strong>{formatCurrency(alert.estimatedChargeUsd)}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <div>
                  <h2 style={sectionTitleStyle}>Service Billing Matrix</h2>
                  <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 13 }}>
                    Thresholds refresh every 5 minutes while this page is open.
                  </p>
                </div>
                <div style={{ color: "#64748B", fontSize: 13 }}>
                  {billing.services.length} monitored services
                </div>
              </div>

              <div style={serviceGridStyle}>
                {billing.services.map((service) => (
                  <article key={service.name} style={serviceCardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <h3 style={{ margin: 0, color: DARK, fontSize: 18 }}>{service.name}</h3>
                        <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 12, textTransform: "capitalize" }}>
                          Source: {service.source}
                        </p>
                      </div>
                      <span style={pillStyle(service.status)}>{service.status.toUpperCase()}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "#0f172a", fontSize: 13, marginBottom: 8 }}>
                      <span>Usage</span>
                      <strong>
                        {service.usage.toFixed(2)} / {service.limit.toFixed(2)} {service.unit}
                      </strong>
                    </div>
                    <div style={{ height: 10, background: "#E2E8F0", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                      <div
                        style={{
                          width: `${Math.min(service.percentage, 100)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: getStatusColor(service.status),
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, color: "#475569", marginBottom: 14 }}>
                      <Metric label="Used" value={`${service.percentage.toFixed(1)}%`} />
                      <Metric label="Est. charge" value={formatCurrency(service.estimatedChargeUsd)} />
                      <Metric label="Alert at" value={`${service.alertThreshold.toFixed(0)}%`} />
                      <Metric label="Critical at" value={`${service.criticalThreshold.toFixed(0)}%`} />
                      <Metric label="Cycle" value={service.billingCycle} />
                      <Metric label="Next date" value={service.nextBillingDate} />
                      <Metric label="Automation" value={service.autoBillingEnabled ? "Enabled" : "Disabled"} />
                      <Metric label="Cap" value={formatCurrency(service.maxAutoChargeUsd)} />
                    </div>

                    <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 12 }}>
                      {service.notes.map((note) => (
                        <p key={note} style={{ margin: "0 0 8px", color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
                          {note}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div style={cardStyle}>No billing data available.</div>
        )}

        {data?.recommendations?.length ? (
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Recommendations</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {data.recommendations.map((item) => (
                <div key={item} style={{ padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#334155", fontSize: 13, lineHeight: 1.6 }}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function FullPageMessage(props: {
  title: string;
  detail: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG, padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 480, textAlign: "center", background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #E2E8F0", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)" }}>
        <h1 style={{ margin: "0 0 10px", color: DARK, fontSize: 28 }}>{props.title}</h1>
        <p style={{ margin: "0 0 20px", color: "#64748B", lineHeight: 1.7 }}>{props.detail}</p>
        {props.actionHref && props.actionLabel ? (
          <Link href={props.actionHref} style={{ display: "inline-block", padding: "10px 18px", borderRadius: 999, background: GOLD, color: DARK, fontWeight: 700, textDecoration: "none" }}>
            {props.actionLabel}
          </Link>
        ) : null}
      </div>
    </main>
  );
}

function SummaryCard(props: { label: string; value: string; meta: string; accent: string }) {
  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: 10 }}>
        {props.label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: props.accent, marginBottom: 8 }}>{props.value}</div>
      <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.5 }}>{props.meta}</div>
    </div>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div style={{ padding: "10px 12px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: 6 }}>
        {props.label}
      </div>
      <div style={{ color: "#0f172a", fontWeight: 700 }}>{props.value}</div>
    </div>
  );
}

function headerLinkStyle(emphasis: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 12,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    color: emphasis ? DARK : "#fff",
    background: emphasis ? GOLD : "rgba(255,255,255,0.12)",
    border: emphasis ? "none" : "1px solid rgba(255,255,255,0.14)",
  };
}

function alertCardStyle(status: "degraded" | "critical"): React.CSSProperties {
  return {
    borderRadius: 16,
    border: `1px solid ${status === "critical" ? "rgba(220,38,38,0.25)" : "rgba(196,148,58,0.35)"}`,
    background: status === "critical" ? "rgba(254,242,242,0.9)" : "rgba(255,251,235,0.95)",
    padding: 16,
  };
}

function pillStyle(status: BillingStatus): React.CSSProperties {
  const color = getStatusColor(status);
  return {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 800,
    background: `${color}18`,
    color,
  };
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  border: "1px solid #E2E8F0",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  padding: 24,
  marginBottom: 20,
};

const errorStyle: React.CSSProperties = {
  background: "#FEF2F2",
  color: "#B91C1C",
  border: "1px solid #FECACA",
  borderRadius: 16,
  padding: "14px 16px",
  marginBottom: 20,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: DARK,
  fontSize: 20,
  fontWeight: 900,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const serviceGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
};

const serviceCardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid #E2E8F0",
  background: "#fff",
  padding: 18,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
};
