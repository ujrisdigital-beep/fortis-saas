"use client";

/**
 * RefundClaim — Claim submission interface.
 * Lets a user submit a refund claim against their guarantee agreement.
 */

import { useState } from "react";

interface Props {
  agreementId: string;
  onSuccess?: () => void;
}

interface FormState {
  reason: string;
  evidenceDescription: string;
}

export default function RefundClaim({ agreementId, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({ reason: "", evidenceDescription: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reason.trim()) return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/activity/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementId,
          reason: form.reason,
          evidence: { description: form.evidenceDescription },
        }),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ ...styles.card, textAlign: "center" }}>
        <p style={{ fontSize: "2rem", margin: 0 }}>✓</p>
        <p style={{ color: "#22c55e", fontWeight: 700, marginTop: "0.5rem" }}>Claim Submitted</p>
        <p style={{ color: "#7a8f82", fontSize: "0.85rem" }}>
          Your refund claim is under review. We'll respond within 3–5 business days.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <p style={styles.label}>SUBMIT REFUND CLAIM</p>
      <h2 style={styles.title}>Request a Refund</h2>
      <p style={{ color: "#7a8f82", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Only submit this if you believe you have met the activity requirements and did not see results within the guarantee period.
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Reason for Claim *</label>
          <select
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            style={styles.input}
            required
          >
            <option value="">Select a reason…</option>
            <option value="completed_requirements_no_results">Completed all requirements — no results</option>
            <option value="platform_issue">Platform issue prevented me from completing tasks</option>
            <option value="content_not_generated">Content generation failed repeatedly</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.fieldLabel}>Evidence / Description *</label>
          <textarea
            value={form.evidenceDescription}
            onChange={(e) => setForm({ ...form, evidenceDescription: e.target.value })}
            placeholder="Describe what actions you took, what results you expected, and what happened instead…"
            rows={5}
            style={{ ...styles.input, resize: "vertical" }}
            required
          />
        </div>

        {status === "error" && errorMsg && (
          <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            ...styles.button,
            opacity: status === "submitting" ? 0.6 : 1,
            cursor: status === "submitting" ? "not-allowed" : "pointer",
          }}
        >
          {status === "submitting" ? "Submitting…" : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#0d1f14",
    border: "1px solid #1e3527",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    fontFamily: "system-ui, sans-serif",
    color: "#e8f0ea",
  } as React.CSSProperties,
  label: {
    color: "#C9A84C",
    fontWeight: 700,
    letterSpacing: "0.08em",
    fontSize: "0.72rem",
    margin: "0 0 0.3rem",
  } as React.CSSProperties,
  title: {
    fontSize: "1.2rem",
    fontWeight: 800,
    margin: "0 0 0.5rem",
  } as React.CSSProperties,
  field: {
    marginBottom: "1rem",
  } as React.CSSProperties,
  fieldLabel: {
    display: "block",
    fontSize: "0.78rem",
    color: "#7a8f82",
    marginBottom: "0.35rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,
  input: {
    width: "100%",
    background: "#112419",
    border: "1px solid #1e3527",
    borderRadius: "0.45rem",
    padding: "0.65rem 0.8rem",
    color: "#e8f0ea",
    fontSize: "0.9rem",
    boxSizing: "border-box" as const,
    outline: "none",
  } as React.CSSProperties,
  button: {
    background: "#C9A84C",
    color: "#112419",
    border: "none",
    borderRadius: "0.45rem",
    padding: "0.75rem 1.5rem",
    fontWeight: 700,
    fontSize: "0.9rem",
    width: "100%",
  } as React.CSSProperties,
};
