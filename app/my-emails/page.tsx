"use client";
import { useState, useEffect } from "react";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

interface EmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  docType: string;
  status: "draft" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
  attachments: string[];
  trackingId: string;
}

// Demo data seeded if localStorage is empty
const DEMO_EMAILS: EmailDraft[] = [
  {
    id: "DOC-1712800001",
    to: "director@mofea.gov.gm",
    subject: "Application for Business Operating Licence",
    body: "Dear Director General,\n\nI am writing to apply for a business operating licence for UJU GROUP LIMITED...\n\nYours faithfully,\nOusman Jallow — UJU GROUP LIMITED",
    docType: "letter",
    status: "sent",
    createdAt: "2026-04-12T09:15:00Z",
    sentAt: "2026-04-12T09:15:32Z",
    attachments: ["company_registration.pdf", "tax_clearance.pdf"],
    trackingId: "TRK-A3FX9K2",
  },
  {
    id: "DOC-1712800002",
    to: "procurement@nawec.gm",
    subject: "Proposal: Solar Energy Installation for NAWEC Substations",
    body: "BUSINESS PROPOSAL\nTo: Procurement Manager, NAWEC\nFrom: Aminata Ceesay — GreenPower Gambia Ltd\n\nWe propose to supply and install 500KW solar PV systems across 5 NAWEC substations...",
    docType: "proposal",
    status: "sent",
    createdAt: "2026-04-11T14:30:00Z",
    sentAt: "2026-04-11T14:30:45Z",
    attachments: ["technical_spec.pdf"],
    trackingId: "TRK-B7YZ1M4",
  },
  {
    id: "DOC-1712800003",
    to: "hr@gambiaports.com",
    subject: "Employment Offer Letter — Senior Logistics Manager",
    body: "Dear Lamin Jallow,\n\nWe are pleased to offer you the position of Senior Logistics Manager...",
    docType: "letter",
    status: "sent",
    createdAt: "2026-04-10T11:00:00Z",
    sentAt: "2026-04-10T11:00:18Z",
    attachments: [],
    trackingId: "TRK-C2QW8P7",
  },
  {
    id: "DOC-1712800004",
    to: "finance@ujugroup.gm",
    subject: "Q1 2026 Financial Report",
    body: "REPORT: Q1 2026 Financial Performance\nDate: 01/04/2026\n\nEXECUTIVE SUMMARY\nRevenue grew 34% YoY to D2.8M. Key drivers: marketplace commissions and SaaS subscriptions...",
    docType: "report",
    status: "sent",
    createdAt: "2026-04-08T08:45:00Z",
    sentAt: "2026-04-08T08:45:55Z",
    attachments: ["q1_financials.xlsx"],
    trackingId: "TRK-D5NP3R9",
  },
  {
    id: "DOC-1712800005",
    to: "legal@partner.gm",
    subject: "Service Agreement — IT Consultancy",
    body: "SERVICE AGREEMENT\n\nThis agreement is entered into between TechGambia Ltd and PartnerCo Ltd...",
    docType: "contract",
    status: "failed",
    createdAt: "2026-04-07T16:20:00Z",
    attachments: [],
    trackingId: "TRK-E8KL6V1",
  },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  sent: { color: "#065F46", bg: "#D1FAE5", label: "✓ Sent" },
  draft: { color: "#78350F", bg: "#FEF3C7", label: "Draft" },
  failed: { color: "#991B1B", bg: "#FEE2E2", label: "✗ Failed" },
};

const DOC_TYPE_ICONS: Record<string, string> = {
  letter: "✉️", report: "📊", contract: "📋", proposal: "💼",
  invoice: "🧾", notice: "📢", certificate: "🏅",
};

export default function MyEmailsPage() {
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "draft" | "failed">("all");
  const [selected, setSelected] = useState<EmailDraft | null>(null);
  const [forwardTo, setForwardTo] = useState("");
  const [forwarding, setForwarding] = useState(false);
  const [forwardSent, setForwardSent] = useState(false);
  const [resending, setResending] = useState<string | null>(null);

  useEffect(() => {
    const stored: EmailDraft[] = JSON.parse(localStorage.getItem("fortis_emails") || "[]");
    if (stored.length === 0) {
      setEmails(DEMO_EMAILS);
    } else {
      // Merge stored with demo, dedup by id
      const ids = new Set(stored.map(e => e.id));
      const merged = [...stored, ...DEMO_EMAILS.filter(e => !ids.has(e.id))];
      setEmails(merged);
    }
  }, []);

  const filtered = emails.filter(e => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (searchQ && !e.subject.toLowerCase().includes(searchQ.toLowerCase()) && !e.to.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const handleResend = async (id: string) => {
    setResending(id);
    await new Promise(r => setTimeout(r, 1800));
    setEmails(prev => prev.map(e => e.id === id ? { ...e, status: "sent", sentAt: new Date().toISOString() } : e));
    setResending(null);
  };

  const handleForward = async () => {
    if (!forwardTo || !selected) return;
    setForwarding(true);
    await new Promise(r => setTimeout(r, 1400));
    const fwd: EmailDraft = {
      ...selected,
      id: `DOC-${Date.now()}`,
      to: forwardTo,
      subject: `FWD: ${selected.subject}`,
      status: "sent",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    setEmails(prev => [fwd, ...prev]);
    setForwarding(false);
    setForwardSent(true);
  };

  const printEmail = (e: EmailDraft) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>${e.subject}</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;font-size:15px;line-height:1.8}h2{color:#1B4D3E}hr{border:1px solid #eee}pre{white-space:pre-wrap}</style></head><body><h2>${e.subject}</h2><hr><p><strong>To:</strong> ${e.to}</p><p><strong>Sent:</strong> ${e.sentAt ? new Date(e.sentAt).toLocaleString() : "Not sent"}</p><p><strong>Tracking ID:</strong> ${e.trackingId}</p><hr><pre>${e.body}</pre></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "48px 24px 36px" };
  const container: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "0 16px" };
  const mainLayout: React.CSSProperties = { display: "grid", gridTemplateColumns: selected ? "360px 1fr" : "1fr", gap: 20, padding: "24px 0" };
  const listCard: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", overflow: "hidden" };
  const emailRow = (active: boolean): React.CSSProperties => ({ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: active ? "#F0FDF4" : "#fff", borderLeft: `3px solid ${active ? G : "transparent"}`, transition: "all 0.15s" });
  const detailCard: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 24 };
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg });
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, boxSizing: "border-box" };
  const iconBtn = (color: string): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${color}`, background: "#fff", color, cursor: "pointer", fontWeight: 600, fontSize: 13 });

  const statCounts = {
    all: emails.length,
    sent: emails.filter(e => e.status === "sent").length,
    draft: emails.filter(e => e.status === "draft").length,
    failed: emails.filter(e => e.status === "failed").length,
  };

  return (
    <div style={page}>
      <div style={hero}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📬 My Email Outbox</h1>
              <p style={{ opacity: 0.8, margin: "4px 0 0", fontSize: 14 }}>Track, resend, forward and download all documents sent from FORTIS OS</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button
                style={{ padding: "10px 20px", background: GOLD, color: NAVY, border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                onClick={() => window.location.href = "/documents/compose"}
              >
                ✍️ Compose New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>
        {/* Stats Bar */}
        <div style={{ display: "flex", gap: 12, padding: "20px 0 0", flexWrap: "wrap" }}>
          {(["all", "sent", "draft", "failed"] as const).map(s => (
            <button
              key={s}
              style={{ padding: "8px 18px", borderRadius: 24, border: `2px solid ${statusFilter === s ? G : "#E2E8F0"}`, background: statusFilter === s ? G : "#fff", color: statusFilter === s ? "#fff" : MUT, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({statCounts[s]})
            </button>
          ))}
          <input
            style={{ ...inputStyle, maxWidth: 280, marginBottom: 0 }}
            placeholder="Search subject or recipient..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>

        <div style={mainLayout}>
          {/* Email List */}
          <div style={listCard}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
              <span style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{filtered.length} emails</span>
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: MUT }}>
                <div style={{ fontSize: 36 }}>📭</div>
                <p>No emails match your filter</p>
              </div>
            )}
            {filtered.map(e => {
              const st = STATUS_STYLE[e.status];
              return (
                <div key={e.id} style={emailRow(selected?.id === e.id)} onClick={() => { setSelected(e); setForwardTo(""); setForwardSent(false); }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{DOC_TYPE_ICONS[e.docType] || "📄"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.subject}</div>
                      <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>To: {e.to}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                        <span style={badge(st.color, st.bg)}>{st.label}</span>
                        <span style={{ fontSize: 11, color: MUT }}>{new Date(e.createdAt).toLocaleDateString()}</span>
                        {e.attachments.length > 0 && <span style={{ fontSize: 11, color: MUT }}>📎 {e.attachments.length}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div>
              <div style={detailCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: NAVY, margin: 0 }}>{selected.subject}</h2>
                    <p style={{ color: MUT, fontSize: 13, margin: "4px 0 0" }}>To: {selected.to}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: MUT }}>×</button>
                </div>

                {/* Meta */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Status", value: STATUS_STYLE[selected.status].label },
                    { label: "Sent", value: selected.sentAt ? new Date(selected.sentAt).toLocaleString() : "Not yet sent" },
                    { label: "Tracking ID", value: selected.trackingId },
                    { label: "Doc Type", value: `${DOC_TYPE_ICONS[selected.docType]} ${selected.docType}` },
                  ].map(m => (
                    <div key={m.label} style={{ background: "#F8FAFC", borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 11, color: MUT, marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Attachments */}
                {selected.attachments.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: MUT, marginBottom: 6 }}>Attachments:</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selected.attachments.map(a => (
                        <span key={a} style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#0369A1" }}>📎 {a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Preview */}
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: 16, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
                  <pre style={{ fontFamily: "Georgia, serif", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1A1A1A", margin: 0 }}>{selected.body}</pre>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  {selected.status === "failed" && (
                    <button
                      style={{ ...iconBtn(G), background: resending === selected.id ? "#F0FDF4" : "#fff" }}
                      onClick={() => handleResend(selected.id)}
                    >
                      {resending === selected.id ? "Resending..." : "🔄 Resend"}
                    </button>
                  )}
                  <button style={iconBtn(NAVY)} onClick={() => printEmail(selected)}>🖨️ Print/PDF</button>
                  <button
                    style={iconBtn("#0369A1")}
                    onClick={() => {
                      const blob = new Blob([selected.body], { type: "text/plain" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${selected.subject.replace(/[^a-z0-9]/gi, "_")}.txt`;
                      a.click();
                    }}
                  >
                    ⬇️ Download
                  </button>
                </div>

                {/* Forward */}
                <div style={{ borderTop: "1.5px solid #F1F5F9", paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8, fontSize: 14 }}>📤 Forward to another recipient</div>
                  {forwardSent ? (
                    <p style={{ color: G, fontWeight: 600, fontSize: 14 }}>✅ Forwarded to {forwardTo}</p>
                  ) : (
                    <div style={{ display: "flex", gap: 10 }}>
                      <input
                        type="email"
                        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                        placeholder="Forward to email address..."
                        value={forwardTo}
                        onChange={e => setForwardTo(e.target.value)}
                      />
                      <button
                        style={{ padding: "10px 18px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: (!forwardTo || forwarding) ? 0.6 : 1 }}
                        disabled={!forwardTo || forwarding}
                        onClick={handleForward}
                      >
                        {forwarding ? "..." : "Forward"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
