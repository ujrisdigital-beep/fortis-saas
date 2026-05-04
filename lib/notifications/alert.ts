// lib/notifications/alert.ts
// AI escalation notification system — Slack + Email
// Humans are invited, not required. Each escalation includes exact instructions.

export interface EscalationPayload {
  issue: string;
  detail: string;
  attemptedFix?: string;
  instructions: string;
  priority: "low" | "medium" | "high" | "critical";
  source?: string;
  timestamp?: string;
}

const PRIORITY_EMOJI: Record<string, string> = {
  low: "🟡",
  medium: "🟠",
  high: "🔴",
  critical: "🚨",
};

export async function escalateToHuman(payload: EscalationPayload): Promise<{ sent: boolean; channels: string[] }> {
  const ts = payload.timestamp ?? new Date().toISOString();
  const emoji = PRIORITY_EMOJI[payload.priority];
  const channels: string[] = [];

  // ── Slack ──────────────────────────────────────────────────────────────────
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      const text = [
        `${emoji} *FORTIS OS ESCALATION* — ${payload.priority.toUpperCase()}`,
        `*Issue:* ${payload.issue}`,
        `*Detail:* ${payload.detail}`,
        payload.attemptedFix ? `*AI Attempted:* ${payload.attemptedFix}` : null,
        `*Your Instructions:*\n\`\`\`${payload.instructions}\`\`\``,
        `*Source:* ${payload.source ?? "Automated Diagnostic"}`,
        `*Time:* ${ts}`,
        `_View escalation queue: /admin/escalations_`,
      ].filter(Boolean).join("\n");

      const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) channels.push("slack");
    } catch {
      // Silent — do not crash platform on notification failure
    }
  }

  // ── Email via Resend / SendGrid ────────────────────────────────────────────
  if (process.env.RESEND_API_KEY && (payload.priority === "critical" || payload.priority === "high")) {
    try {
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0F3D21;padding:20px;border-radius:8px 8px 0 0">
            <h2 style="color:#C4943A;margin:0">FORTIS OS — ${emoji} ${payload.priority.toUpperCase()} ESCALATION</h2>
          </div>
          <div style="border:1px solid #E2E8F0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Issue:</strong> ${payload.issue}</p>
            <p><strong>Detail:</strong> ${payload.detail}</p>
            ${payload.attemptedFix ? `<p><strong>AI Attempted:</strong> ${payload.attemptedFix}</p>` : ""}
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:12px;margin:16px 0">
              <p style="margin:0 0 8px;font-weight:700">Your Instructions:</p>
              <code style="font-size:13px;white-space:pre-wrap">${payload.instructions}</code>
            </div>
            <p style="color:#6B7280;font-size:12px">Time: ${ts} · FORTIS OS AI Supervisor</p>
          </div>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FORTIS OS <alerts@fortisos.cloud>",
          to: [process.env.ADMIN_EMAIL ?? "ujrisdigital@gmail.com"],
          subject: `${emoji} FORTIS OS ${payload.priority.toUpperCase()}: ${payload.issue}`,
          html,
        }),
      });
      channels.push("email");
    } catch {
      // Silent
    }
  }

  // ── Fallback: console log (always) ────────────────────────────────────────
  console.error("[FORTIS-ESCALATION]", JSON.stringify({ ...payload, ts }));

  return { sent: channels.length > 0, channels };
}

// ── Store escalation in memory (edge-compatible, no DB required) ─────────────
const ESCALATION_STORE: EscalationPayload[] = [];
const MAX_STORE = 50;

export function storeEscalation(payload: EscalationPayload): void {
  ESCALATION_STORE.unshift({ ...payload, timestamp: payload.timestamp ?? new Date().toISOString() });
  if (ESCALATION_STORE.length > MAX_STORE) ESCALATION_STORE.pop();
}

export function getStoredEscalations(): EscalationPayload[] {
  return [...ESCALATION_STORE];
}

export function clearEscalation(index: number): void {
  ESCALATION_STORE.splice(index, 1);
}
