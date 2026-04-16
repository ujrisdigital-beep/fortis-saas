"use client";

import { useState } from "react";
import { boardAlerts, boardMetrics, personalBriefing, projectHeatMap } from "../../../data/board-dashboard";

function metricPercent(value: number, max: number) {
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function riskStyle(risk: "ON_TRACK" | "AT_RISK" | "CRITICAL") {
  if (risk === "ON_TRACK") {
    return { background: "rgba(16,185,129,0.12)", color: "#10B981" };
  }
  if (risk === "AT_RISK") {
    return { background: "rgba(201,168,76,0.12)", color: "#C9A84C" };
  }
  return { background: "rgba(230,57,70,0.12)", color: "#E63946" };
}

export default function BoardDashboardPage() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBriefing() {
    setLoading(true);
    setBriefing("");

    const response = await fetch("/api/ai/board-briefing", { method: "POST" });
    if (!response.body) {
      setBriefing("Failed to load briefing.");
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        if (!event.startsWith("data: ")) {
          continue;
        }
        const payload = event.slice(6).trim();
        if (payload === "[DONE]") {
          continue;
        }
        const parsed = JSON.parse(payload) as { chunk?: string };
        if (parsed.chunk) {
          setBriefing((prev: string) => prev + parsed.chunk);
        }
      }
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1rem" }}>
      <section className="fortis-card" style={{ padding: "1.25rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem" }}>CEO & BOARD COMMAND</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "2rem" }}>Board Dashboard</h1>
        <p style={{ color: "var(--fortis-text-secondary)", marginTop: "0.5rem" }}>Executive visibility across delivery, funding, partnerships, and sprint execution.</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.8rem" }}>
        {boardMetrics.map((item) => {
          const percent = metricPercent(item.value, item.max);
          return (
            <article key={item.id} className="fortis-card" style={{ padding: "1rem" }}>
              <div style={{ color: "var(--fortis-text-secondary)", fontSize: "0.85rem" }}>{item.label}</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 800, marginTop: "0.4rem" }}>
                {item.value}{item.suffix ? ` ${item.suffix}` : ""}
              </div>
              <div style={{ height: 8, background: "rgba(201,168,76,0.15)", borderRadius: 999, marginTop: "0.65rem" }}>
                <div style={{ width: `${percent}%`, height: "100%", background: "#C9A84C", borderRadius: 999 }} />
              </div>
              <div style={{ marginTop: "0.45rem", color: "var(--fortis-text-secondary)", fontSize: "0.8rem" }}>{item.trend}</div>
            </article>
          );
        })}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        <div className="fortis-card" style={{ padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>AI Next-Action Panel</h2>
            <button onClick={loadBriefing} style={{ border: "none", background: "#C9A84C", color: "#112419", padding: "0.6rem 0.9rem", borderRadius: "0.5rem", fontWeight: 700, cursor: "pointer", boxShadow: loading ? "0 0 18px rgba(201,168,76,0.45)" : "none" }}>
              {loading ? "Generating..." : "Generate Board Brief"}
            </button>
          </div>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", color: "#F5F0E8", marginTop: "1rem", minHeight: 180 }}>{briefing || "No briefing generated yet."}</pre>
        </div>

        <div className="fortis-card" style={{ padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Cadjatu Djalo Briefing</h2>
          <p style={{ color: "var(--fortis-text-secondary)", fontSize: "0.9rem" }}>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Banjul" })}</p>
          <div style={{ marginTop: "1rem" }}>
            <strong>Pending sign-offs</strong>
            <ul>{personalBriefing.pendingSignoffs.map((item) => <li key={item}>{item}</li>)}</ul>
            <strong>Flagged emails</strong>
            <ul>{personalBriefing.flaggedEmails.map((item) => <li key={item}>{item}</li>)}</ul>
            <strong>Upcoming meetings</strong>
            <ul>{personalBriefing.meetings.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="fortis-card" style={{ padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Project Heat Map</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--fortis-text-secondary)" }}>
                <th style={cellHead}>Project</th>
                <th style={cellHead}>Vertical</th>
                <th style={cellHead}>Status</th>
                <th style={cellHead}>Budget (GMD)</th>
                <th style={cellHead}>Progress</th>
                <th style={cellHead}>Risk</th>
                <th style={cellHead}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {projectHeatMap.map((item) => (
                <tr key={item.project}>
                  <td style={cellBody}>{item.project}</td>
                  <td style={cellBody}>{item.vertical}</td>
                  <td style={cellBody}>{item.status}</td>
                  <td style={cellBody}>{item.budgetGmd.toLocaleString()}</td>
                  <td style={cellBody}>{item.progress}%</td>
                  <td style={cellBody}><span style={{ ...riskStyle(item.risk), padding: "0.25rem 0.45rem", borderRadius: 999, fontWeight: 700 }}>{item.risk.replace("_", " ")}</span></td>
                  <td style={cellBody}>{item.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1rem" }}>
        <div className="fortis-card" style={{ padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Notifications</h2>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {boardAlerts.map((alert) => (
              <div key={alert.id} style={{ padding: "0.8rem", borderRadius: "0.75rem", background: toneMap[alert.tone].background, color: toneMap[alert.tone].color }}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
        <div className="fortis-card" style={{ padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <a href="/investors" style={actionLink}>Generate Board Report</a>
            <a href="/funding" style={actionLink}>New Grant Search</a>
            <a href="/payments" style={actionLink}>Review Payment Rails</a>
            <a href="/dashboard" style={actionLink}>Log Project Update</a>
          </div>
        </div>
      </section>
    </main>
  );
}

const cellHead = { padding: "0.7rem 0.5rem", borderBottom: "1px solid rgba(201,168,76,0.18)" };
const cellBody = { padding: "0.8rem 0.5rem", borderBottom: "1px solid rgba(201,168,76,0.08)" };
const actionLink = { textDecoration: "none", color: "#112419", background: "#C9A84C", padding: "0.75rem 0.85rem", borderRadius: "0.55rem", fontWeight: 700 };
const toneMap = {
  red: { background: "rgba(230,57,70,0.12)", color: "#E63946" },
  gold: { background: "rgba(201,168,76,0.12)", color: "#FFD700" },
  amber: { background: "rgba(201,168,76,0.18)", color: "#C9A84C" },
  teal: { background: "rgba(16,185,129,0.12)", color: "#10B981" },
};
