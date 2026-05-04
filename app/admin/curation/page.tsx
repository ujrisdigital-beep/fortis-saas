"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface ContentItem {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  category: string;
  relevanceScore: number;
  status: string;
  citation: string;
  tags: string[];
  originalUrl: string;
}

export default function CurationPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  async function fetchContent() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content-fetch");
      const data = await res.json();
      setContent(data.content ?? []);
      setFetched(true);
    } catch {
      alert("Failed to fetch content. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function approve(id: string) {
    setApproved((prev) => { const n = new Set(prev); n.add(id); return n; });
    setRejected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function reject(id: string) {
    setRejected((prev) => { const n = new Set(prev); n.add(id); return n; });
    setApproved((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function getStatus(id: string) {
    if (approved.has(id)) return "approved";
    if (rejected.has(id)) return "rejected";
    return "pending";
  }

  const filtered = content.filter((c) => {
    if (filter === "all") return true;
    return getStatus(c.id) === filter;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "2.5rem 1.5rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
            <Link href="/admin/status" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>← Admin</Link>
          </div>
          <h1 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800 }}>
            📚 Content Curation Dashboard
          </h1>
          <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>
            Fetch, review, and approve external content for the FORTIS OS Knowledge Hub. All content is human-reviewed before publication.
          </p>
          <button
            onClick={fetchContent}
            disabled={loading}
            style={{ padding: "0.65rem 1.4rem", background: loading ? "#9CA3AF" : GOLD, color: DARK, border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
          >
            {loading ? "⏳ Fetching…" : "🔄 Fetch Latest Content"}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {!fetched && !loading && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>📡</div>
            <p style={{ fontWeight: 700, color: DARK, margin: "0 0 0.5rem" }}>No content fetched yet</p>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Click &quot;Fetch Latest Content&quot; to pull content from Gambian news sources and score by relevance.
            </p>
          </div>
        )}

        {fetched && (
          <>
            {/* Stats + filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(["all", "pending", "approved", "rejected"] as const).map((f) => {
                  const count = f === "all" ? content.length : content.filter((c) => getStatus(c.id) === f).length;
                  const colors: Record<string, { bg: string; text: string }> = {
                    all: { bg: PRIMARY, text: WHITE },
                    pending: { bg: "#FEF3C7", text: "#92400E" },
                    approved: { bg: "#D1FAE5", text: "#065F46" },
                    rejected: { bg: "#FEE2E2", text: "#991B1B" },
                  };
                  const c = colors[f];
                  return (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.45rem 0.9rem", borderRadius: 8, border: "1.5px solid #E2E8F0", background: filter === f ? c.bg : WHITE, color: filter === f ? c.text : DARK, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                      {f} ({count})
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
                {approved.size} approved · {rejected.size} rejected
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {filtered.map((item) => {
                const status = getStatus(item.id);
                return (
                  <div key={item.id} style={{
                    background: WHITE,
                    border: `1.5px solid ${status === "approved" ? "#BBF7D0" : status === "rejected" ? "#FECACA" : "#E2E8F0"}`,
                    borderRadius: 10, padding: "1.1rem 1.25rem",
                    opacity: status === "rejected" ? 0.6 : 1,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.25rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: DARK }}>{item.title}</span>
                          <span style={{ fontSize: "0.65rem", padding: "1px 7px", borderRadius: 999, background: item.relevanceScore >= 70 ? "#D1FAE5" : item.relevanceScore >= 40 ? "#FEF3C7" : "#F3F4F6", color: item.relevanceScore >= 70 ? "#065F46" : item.relevanceScore >= 40 ? "#92400E" : "#6B7280", fontWeight: 700 }}>
                            {item.relevanceScore}% relevance
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginBottom: "0.4rem" }}>
                          📰 {item.source} · {item.category}
                        </div>
                        <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "#374151", lineHeight: 1.6 }}>{item.excerpt}</p>
                        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "0.4rem 0.7rem", fontSize: "0.7rem", color: "#6B7280", fontStyle: "italic" }}>
                          📎 {item.citation}
                        </div>
                        {item.tags.length > 0 && (
                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                            {item.tags.map((tag) => (
                              <span key={tag} style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 999, background: "#E8F5EF", color: PRIMARY, fontWeight: 600 }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                        {status === "pending" ? (
                          <>
                            <button onClick={() => approve(item.id)} style={{ padding: "0.45rem 1rem", background: "#22C55E", color: WHITE, border: "none", borderRadius: 7, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                              ✓ Approve
                            </button>
                            <button onClick={() => reject(item.id)} style={{ padding: "0.45rem 1rem", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA", borderRadius: 7, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                              ✕ Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: status === "approved" ? "#16A34A" : "#DC2626" }}>
                            {status === "approved" ? "✅ Approved" : "❌ Rejected"}
                          </span>
                        )}
                        <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: PRIMARY, textDecoration: "none", fontWeight: 600, textAlign: "center" }}>
                          View source →
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {approved.size > 0 && (
              <div style={{ marginTop: "1.5rem", background: "#D1FAE5", border: "1.5px solid #BBF7D0", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#065F46", fontSize: "0.88rem" }}>✅ {approved.size} items approved</div>
                  <div style={{ fontSize: "0.75rem", color: "#16A34A" }}>Publish to Knowledge Hub to make them live for users.</div>
                </div>
                <button style={{ padding: "0.55rem 1.25rem", background: PRIMARY, color: WHITE, border: "none", borderRadius: 9, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Publish {approved.size} to Knowledge Hub →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
