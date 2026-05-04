"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

type Message = { role: "user" | "assistant"; content: string; intent?: string };

const SUGGESTIONS = [
  { icon: "⚖️", text: "How do I appeal a PIP decision in The Gambia?" },
  { icon: "🌾", text: "Create a 90-day business plan for my groundnut farm" },
  { icon: "📱", text: "Write a LinkedIn post about digital skills in Gambia" },
  { icon: "📊", text: "Explain GIEPA investment incentives for my hotel" },
];

// ── Simple inline markdown renderer ─────────────────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    key++;

    if (line.startsWith("## ")) {
      elements.push(
        <p key={key} style={{ margin: "10px 0 4px", fontWeight: 800, fontSize: 13, color: DARK }}>
          {inlineFormat(line.slice(3))}
        </p>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <p key={key} style={{ margin: "12px 0 4px", fontWeight: 900, fontSize: 14, color: DARK }}>
          {inlineFormat(line.slice(2))}
        </p>
      );
    } else if (/^[\d]+\.\s/.test(line)) {
      elements.push(
        <div key={key} style={{ display: "flex", gap: 6, margin: "3px 0" }}>
          <span style={{ fontWeight: 700, color: GOLD, flexShrink: 0, fontSize: 12 }}>
            {line.match(/^(\d+)\./)?.[1]}.
          </span>
          <span style={{ fontSize: 12, lineHeight: 1.55, color: "#1F2937" }}>
            {inlineFormat(line.replace(/^\d+\.\s/, ""))}
          </span>
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key} style={{ display: "flex", gap: 6, margin: "2px 0" }}>
          <span style={{ color: GOLD, flexShrink: 0, marginTop: 1, fontSize: 10 }}>●</span>
          <span style={{ fontSize: 12, lineHeight: 1.55, color: "#374151" }}>
            {inlineFormat(line.slice(2))}
          </span>
        </div>
      );
    } else if (line.trim() === "" || line.trim() === "---") {
      elements.push(<div key={key} style={{ height: 6 }} />);
    } else if (line.trim()) {
      elements.push(
        <p key={key} style={{ margin: "2px 0", fontSize: 12, lineHeight: 1.6, color: "#374151" }}>
          {inlineFormat(line)}
        </p>
      );
    }
  }
  return elements;
}

function inlineFormat(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: DARK }}>{p.slice(2, -2)}</strong>;
    }
    // Italic: *text*
    const italicParts = p.split(/(\*[^*]+\*)/g);
    return italicParts.map((ip, j) => {
      if (ip.startsWith("*") && ip.endsWith("*") && ip.length > 2) {
        return <em key={j}>{ip.slice(1, -1)}</em>;
      }
      return <span key={j}>{ip}</span>;
    });
  });
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FloatingUJU() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDots, setShowDots] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Animated dots for loading
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setShowDots(d => (d + 1) % 4), 450);
    return () => clearInterval(t);
  }, [loading]);

  async function send(queryText: string) {
    const text = queryText.trim();
    if (!text || loading) return;
    setQuery("");

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/uju-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, history }),
      });
      const data = await res.json() as { answer?: string; intent?: string; intentLabel?: string; error?: string };
      const answer = data.answer ?? data.error ?? "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: answer, intent: data.intentLabel }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(query);
  }

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open UJU Cycle AI assistant"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1200,
          width: 58, height: 58, borderRadius: "50%", border: "none",
          background: `linear-gradient(135deg, ${DARK} 0%, ${G} 50%, #2A7A5E 100%)`,
          boxShadow: "0 6px 24px rgba(10,46,26,0.40), 0 2px 8px rgba(0,0,0,0.18)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, transition: "transform 0.18s, box-shadow 0.18s",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 10px 32px rgba(10,46,26,0.48), 0 3px 10px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(10,46,26,0.40), 0 2px 8px rgba(0,0,0,0.18)";
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Tooltip */}
      {!open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 1199,
          background: DARK, color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "5px 10px", borderRadius: 6, pointerEvents: "none",
          fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: "0.03em",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", whiteSpace: "nowrap",
        }}>
          Ask UJU Cycle ✨
        </div>
      )}

      {/* ── Chat window ─────────────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 1190,
          width: 380, maxWidth: "calc(100vw - 32px)",
          height: 560, maxHeight: "calc(100vh - 110px)",
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>

          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`,
            padding: "14px 16px", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>🔄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>
                  UJU Cycle AI
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>
                  FORTIS OS · Gambia-specialised intelligence
                </div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 4px" }}>

            {/* Empty state */}
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🇬🇲</div>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 14, color: DARK }}>
                  What can I help you with?
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>
                  Legal · Business · Content · Analysis · Learning
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.text)}
                      style={{
                        background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 10,
                        padding: "8px 10px", cursor: "pointer", textAlign: "left",
                        display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "inherit",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    >
                      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                      <span style={{ fontSize: 11, color: "#374151", lineHeight: 1.5 }}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                {msg.role === "assistant" && msg.intent && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: G,
                    background: `${GOLD}18`, border: `1px solid ${GOLD}30`,
                    borderRadius: 999, padding: "2px 7px", marginBottom: 4,
                    letterSpacing: "0.05em",
                  }}>
                    {msg.intent}
                  </span>
                )}
                <div style={{
                  maxWidth: "88%",
                  background: msg.role === "user" ? `linear-gradient(135deg, ${G}, #2A7A5E)` : "#F3F4F6",
                  color: msg.role === "user" ? "#fff" : "#1F2937",
                  padding: msg.role === "user" ? "9px 13px" : "10px 13px",
                  borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  fontSize: 12, lineHeight: 1.55,
                }}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div>{renderMarkdown(msg.content)}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  background: "#F3F4F6", padding: "10px 14px", borderRadius: "4px 14px 14px 14px",
                  fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ display: "flex", gap: 3 }}>
                    {[0, 1, 2].map(d => (
                      <span
                        key={d}
                        style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: showDots > d ? G : "#D1D5DB",
                          transition: "background 0.15s",
                        }}
                      />
                    ))}
                  </span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>UJU Cycle thinking…</span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #F3F4F6", padding: "10px 12px", flexShrink: 0 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask anything about Gambia…"
                disabled={loading}
                style={{
                  flex: 1, padding: "9px 13px", borderRadius: 20,
                  border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none",
                  background: "#F9FAFB", color: "#111827", fontFamily: "inherit",
                  resize: "none",
                }}
                onFocus={e => (e.target.style.borderColor = G)}
                onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(query); } }}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: "none", flexShrink: 0,
                  background: loading || !query.trim() ? "#E5E7EB" : `linear-gradient(135deg, ${G}, #2A7A5E)`,
                  color: loading || !query.trim() ? "#9CA3AF" : "#fff",
                  cursor: loading || !query.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, transition: "background 0.15s",
                }}
              >
                ↑
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: "#C4B8A0" }}>
              Powered by UJU Cycle · FORTIS OS™ ·{" "}
              <Link href="/uju-cycle" style={{ color: GOLD, textDecoration: "none" }}>Full suite</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
