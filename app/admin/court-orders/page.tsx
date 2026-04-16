"use client";
// app/admin/court-orders/page.tsx
// Court Order PII Access — Admin Dashboard (Gambia Data Protection Act)
import { useState, useEffect, useCallback } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#D4AF37";
const TEXT    = "#0A1C2E";
const BG      = "#F8F9FA";
const WHITE   = "#FFFFFF";
const BORDER  = "#E2E8F0";
const RED     = "#DC2626";
const GREEN   = "#16A34A";
const AMBER   = "#D97706";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CourtOrderSummary {
  id: string;
  requestingAdmin: string;
  reason: string;
  status: "pending" | "active" | "expired" | "revoked";
  createdAt: string;
  expiresAt: string;
}

interface CourtOrderDetail extends CourtOrderSummary {
  approvedBy?: string;
  approvedAt?: string;
  auditLogs: { action: string; performedBy: string; loggedAt: string }[];
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  recent: CourtOrderSummary[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function statusColor(status: string) {
  if (status === "active")  return GREEN;
  if (status === "pending") return AMBER;
  if (status === "revoked") return RED;
  return "#6B7280"; // expired
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminCourtOrders() {
  const [adminToken, setAdminToken] = useState("");
  const [authed,     setAuthed]     = useState(false);
  const [authError,  setAuthError]  = useState("");

  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [selectedId,     setSelectedId]     = useState<string | null>(null);
  const [detail,         setDetail]         = useState<CourtOrderDetail | null>(null);
  const [detailLoading,  setDetailLoading]  = useState(false);

  const [actionLoading,  setActionLoading]  = useState(false);
  const [actionResult,   setActionResult]   = useState<{ token?: string; message?: string; error?: string } | null>(null);
  const [revokeReason,   setRevokeReason]   = useState("");
  const [showRevoke,     setShowRevoke]     = useState(false);

  // ── Fetch list ──
  const fetchList = useCallback(async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/court-order/verify", {
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to load"); return; }
      setStats(data);
      setAuthed(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth ──
  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    fetchList(adminToken);
  }

  // ── Select request ──
  async function handleSelect(id: string) {
    setSelectedId(id);
    setDetail(null);
    setActionResult(null);
    setShowRevoke(false);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/court-order/verify?requestId=${id}`, {
        headers: { "x-admin-token": adminToken },
      });
      const data = await res.json();
      if (res.ok) setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }

  // ── Approve ──
  async function handleApprove() {
    if (!selectedId) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch("/api/court-order/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
          "x-admin-id": "admin-ui",
        },
        body: JSON.stringify({ requestId: selectedId, action: "approve" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionResult({ token: data.accessToken, message: data.message });
        fetchList(adminToken);
        handleSelect(selectedId);
      } else {
        setActionResult({ error: data.error });
      }
    } finally {
      setActionLoading(false);
    }
  }

  // ── Revoke ──
  async function handleRevoke() {
    if (!selectedId) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch("/api/court-order/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
          "x-admin-id": "admin-ui",
        },
        body: JSON.stringify({
          requestId: selectedId,
          action: "revoke",
          revokeReason: revokeReason || "Revoked by administrator",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionResult({ message: data.message });
        setShowRevoke(false);
        fetchList(adminToken);
        handleSelect(selectedId);
      } else {
        setActionResult({ error: data.error });
      }
    } finally {
      setActionLoading(false);
    }
  }

  // ─── Login Gate ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleAuth} style={{
          background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: "2.5rem", width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
            <span style={{ fontSize: 28 }}>⚖️</span>
            <div>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 18 }}>Court Order Admin</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>Gambia Data Protection Act</div>
            </div>
          </div>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
            Admin Secret Token
          </label>
          <input
            type="password"
            value={adminToken}
            onChange={e => setAdminToken(e.target.value)}
            placeholder="Enter ADMIN_SECRET"
            required
            style={{
              width: "100%", padding: "0.6rem 0.8rem", border: `1.5px solid ${BORDER}`,
              borderRadius: 7, fontSize: 14, color: TEXT, marginBottom: "1rem",
              outline: "none", boxSizing: "border-box",
            }}
          />

          {authError && (
            <div style={{ color: RED, fontSize: 13, marginBottom: "0.8rem" }}>{authError}</div>
          )}
          {error && (
            <div style={{ color: RED, fontSize: 13, marginBottom: "0.8rem" }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.7rem", background: PRIMARY, color: WHITE,
            border: "none", borderRadius: 7, fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}>
            {loading ? "Verifying…" : "Access Dashboard"}
          </button>

          <p style={{ marginTop: "1rem", fontSize: 12, color: "#6B7280", textAlign: "center" }}>
            All access is logged under the Gambia Data Protection Act.
          </p>
        </form>
      </div>
    );
  }

  // ─── Main Dashboard ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: PRIMARY, padding: "1rem 2rem", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>⚖️</span>
        <div>
          <div style={{ color: WHITE, fontWeight: 700, fontSize: 18 }}>Court Order PII Access</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Gambia Data Protection Act — All actions logged
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => fetchList(adminToken)} style={refreshBtnStyle}>
            ↻ Refresh
          </button>
          <button onClick={() => { setAuthed(false); setAdminToken(""); }} style={logoutBtnStyle}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div style={{ display: "flex", gap: 16, padding: "1.25rem 2rem", background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
          {[
            { label: "Total Requests", value: stats.total, color: TEXT },
            { label: "Active",         value: stats.active, color: GREEN },
            { label: "Pending Review", value: stats.pending, color: AMBER },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: BG, borderRadius: 8, padding: "0.9rem 1.2rem",
              border: `1px solid ${BORDER}`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", height: "calc(100vh - 140px)" }}>
        {/* List panel */}
        <div style={{
          width: 340, borderRight: `1px solid ${BORDER}`, background: WHITE,
          overflowY: "auto", flexShrink: 0,
        }}>
          <div style={{ padding: "1rem", borderBottom: `1px solid ${BORDER}`, fontWeight: 700, color: TEXT, fontSize: 15 }}>
            Recent Requests ({stats?.recent.length ?? 0})
          </div>

          {loading && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>Loading…</div>
          )}

          {stats?.recent.map(r => (
            <div
              key={r.id}
              onClick={() => handleSelect(r.id)}
              style={{
                padding: "0.9rem 1rem",
                borderBottom: `1px solid ${BORDER}`,
                cursor: "pointer",
                background: selectedId === r.id ? `${PRIMARY}10` : WHITE,
                borderLeft: selectedId === r.id ? `3px solid ${PRIMARY}` : "3px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, maxWidth: 180 }}>
                  {r.requestingAdmin}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: WHITE,
                  background: statusColor(r.status), borderRadius: 20, padding: "2px 8px",
                }}>
                  {statusLabel(r.status)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 1.4 }}>
                {r.reason.length > 60 ? r.reason.slice(0, 60) + "…" : r.reason}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                {fmt(r.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
          {!selectedId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#9CA3AF" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
              <div style={{ fontSize: 15 }}>Select a request to review</div>
            </div>
          )}

          {detailLoading && (
            <div style={{ textAlign: "center", color: "#6B7280", paddingTop: "4rem" }}>Loading details…</div>
          )}

          {detail && !detailLoading && (
            <div>
              {/* Title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: WHITE,
                  background: statusColor(detail.status), borderRadius: 20, padding: "4px 14px",
                }}>
                  {statusLabel(detail.status)}
                </span>
                <div style={{ fontSize: 13, color: "#6B7280", fontFamily: "monospace" }}>
                  ID: {detail.id}
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
                {[
                  { label: "Requesting Admin", value: detail.requestingAdmin },
                  { label: "Status",           value: statusLabel(detail.status) },
                  { label: "Submitted",         value: fmt(detail.createdAt) },
                  { label: "Expires",           value: fmt(detail.expiresAt) },
                  ...(detail.approvedBy ? [
                    { label: "Approved By", value: detail.approvedBy },
                    { label: "Approved At", value: fmt(detail.approvedAt!) },
                  ] : []),
                ].map(f => (
                  <div key={f.label} style={{
                    background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "0.9rem 1rem",
                  }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: TEXT, fontWeight: 600 }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div style={{
                background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "1rem", marginBottom: "1.5rem",
              }}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>
                  STATED LEGAL REASON
                </div>
                <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>{detail.reason}</div>
              </div>

              {/* Action result */}
              {actionResult && (
                <div style={{
                  background: actionResult.error ? "#FEF2F2" : "#F0FDF4",
                  border: `1px solid ${actionResult.error ? "#FECACA" : "#BBF7D0"}`,
                  borderRadius: 8, padding: "1rem", marginBottom: "1.5rem",
                }}>
                  {actionResult.error && (
                    <div style={{ color: RED, fontSize: 14 }}>{actionResult.error}</div>
                  )}
                  {actionResult.message && (
                    <div style={{ color: GREEN, fontWeight: 600, fontSize: 14, marginBottom: actionResult.token ? 8 : 0 }}>
                      {actionResult.message}
                    </div>
                  )}
                  {actionResult.token && (
                    <div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                        ACCESS TOKEN — Store securely, cannot be retrieved again:
                      </div>
                      <div style={{
                        fontFamily: "monospace", fontSize: 13, background: WHITE,
                        border: `1px solid ${BORDER}`, borderRadius: 6, padding: "0.6rem 0.8rem",
                        wordBreak: "break-all", color: TEXT,
                      }}>
                        {actionResult.token}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {detail.status === "pending" && (
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    style={approveBtnStyle}
                  >
                    {actionLoading ? "Processing…" : "✓ Approve & Issue Token"}
                  </button>
                )}

                {(detail.status === "pending" || detail.status === "active") && (
                  <button
                    onClick={() => setShowRevoke(!showRevoke)}
                    style={revokeBtnStyle}
                  >
                    ✕ Revoke Access
                  </button>
                )}
              </div>

              {/* Revoke reason input */}
              {showRevoke && (
                <div style={{
                  background: "#FEF2F2", border: `1px solid #FECACA`,
                  borderRadius: 8, padding: "1rem", marginBottom: "1.5rem",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: RED, marginBottom: 8 }}>
                    Confirm Revocation
                  </div>
                  <textarea
                    value={revokeReason}
                    onChange={e => setRevokeReason(e.target.value)}
                    placeholder="State reason for revocation (required for audit log)…"
                    rows={3}
                    style={{
                      width: "100%", padding: "0.6rem 0.8rem", border: `1.5px solid #FECACA`,
                      borderRadius: 6, fontSize: 13, color: TEXT, resize: "vertical",
                      outline: "none", boxSizing: "border-box", marginBottom: 8,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleRevoke} disabled={actionLoading} style={confirmRevokeBtnStyle}>
                      {actionLoading ? "Revoking…" : "Confirm Revoke"}
                    </button>
                    <button onClick={() => setShowRevoke(false)} style={cancelBtnStyle}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Audit log */}
              <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "1rem" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                  Audit Trail ({detail.auditLogs.length} events)
                </div>
                {detail.auditLogs.length === 0 && (
                  <div style={{ color: "#9CA3AF", fontSize: 13 }}>No events logged yet.</div>
                )}
                {detail.auditLogs.map((log, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: "0.6rem 0",
                    borderBottom: i < detail.auditLogs.length - 1 ? `1px solid ${BORDER}` : "none",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: log.action === "approved" ? GREEN
                        : log.action === "revoked" ? RED
                        : log.action === "token_used" ? PRIMARY
                        : AMBER,
                    }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, color: TEXT, fontSize: 13 }}>
                        {log.action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span style={{ color: "#6B7280", fontSize: 12, marginLeft: 8 }}>
                        by {log.performedBy}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {fmt(log.loggedAt)}
                    </div>
                  </div>
                ))}
              </div>

              {/* DPA notice */}
              <div style={{
                marginTop: "1.5rem", padding: "0.8rem 1rem",
                background: `${GOLD}15`, border: `1px solid ${GOLD}40`,
                borderRadius: 8, fontSize: 12, color: "#92400E",
              }}>
                ⚠️ All actions on this page are logged under the Gambia Data Protection Act.
                Unauthorised access or misuse is a criminal offence.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Button styles ────────────────────────────────────────────────────────────
const approveBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.4rem", background: GREEN, color: WHITE,
  border: "none", borderRadius: 7, fontWeight: 700, fontSize: 14, cursor: "pointer",
};
const revokeBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.4rem", background: WHITE, color: RED,
  border: `1.5px solid ${RED}`, borderRadius: 7, fontWeight: 700, fontSize: 14, cursor: "pointer",
};
const confirmRevokeBtnStyle: React.CSSProperties = {
  padding: "0.5rem 1.2rem", background: RED, color: WHITE,
  border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: "pointer",
};
const cancelBtnStyle: React.CSSProperties = {
  padding: "0.5rem 1.2rem", background: WHITE, color: TEXT,
  border: `1.5px solid ${BORDER}`, borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer",
};
const refreshBtnStyle: React.CSSProperties = {
  padding: "0.4rem 1rem", background: "rgba(255,255,255,0.15)", color: WHITE,
  border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const logoutBtnStyle: React.CSSProperties = {
  padding: "0.4rem 1rem", background: "transparent", color: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, fontSize: 13, cursor: "pointer",
};
