"use client";

import { useState } from "react";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

export interface ContactFormProps {
  type: "partnership" | "meeting" | "general" | "support";
  buttonText?: string;
  title?: string;
  subtitle?: string;
  inline?: boolean;
}

export default function ContactForm({
  type,
  buttonText = "Send Message",
  title,
  subtitle,
  inline = false,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getSubject = () => {
    switch (type) {
      case "partnership": return "Partnership Request";
      case "meeting":     return "Meeting Request with CEO";
      case "support":     return "Support Request";
      default:            return "General Inquiry";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organisation, message, subject: getSubject(), type }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setOrganisation("");
        setTimeout(() => setSuccess(false), 6000);
      } else {
        setError("Failed to send. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 16px",
    borderRadius: 30,
    border: "1.5px solid #E5E7EB",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: "#fff",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    borderRadius: 14,
    resize: "vertical" as const,
  };

  if (inline) {
    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input type="text" placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} required style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
          <input type="email" placeholder="Email Address *" value={email} onChange={e => setEmail(e.target.value)} required style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
        </div>
        <input type="text" placeholder="Organisation (optional)" value={organisation} onChange={e => setOrganisation(e.target.value)} style={inputStyle} />
        <textarea placeholder="Your Message *" value={message} onChange={e => setMessage(e.target.value)} required rows={3} style={textareaStyle} />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: G, color: "#fff", padding: "12px 24px", borderRadius: 30,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: 13, fontFamily: "inherit", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Sending…" : buttonText}
        </button>
        {success && <div style={{ color: "#10B981", fontSize: 13, textAlign: "center", fontWeight: 600 }}>✓ Message sent! We'll respond within 24 hours.</div>}
        {error && <div style={{ color: "#DC2626", fontSize: 13, textAlign: "center" }}>{error}</div>}
      </form>
    );
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "32px",
      maxWidth: 520, margin: "0 auto",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      {title && (
        <h3 style={{ fontSize: 22, fontWeight: 800, color: DARK, margin: "0 0 6px", textAlign: "center" }}>{title}</h3>
      )}
      {subtitle ? (
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 24, fontSize: 13 }}>{subtitle}</p>
      ) : (
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 24, fontSize: 13 }}>
          Fill out the form and we&apos;ll respond within 24 hours.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Email Address *" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="Organisation / Company" value={organisation} onChange={e => setOrganisation(e.target.value)} style={inputStyle} />
        <textarea placeholder="Your Message *" value={message} onChange={e => setMessage(e.target.value)} required rows={5} style={textareaStyle} />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: `linear-gradient(135deg, ${DARK}, ${G})`,
            color: "#fff", padding: "14px", borderRadius: 30,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: 14, fontFamily: "inherit", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Sending…" : buttonText}
        </button>
        {success && (
          <div style={{ background: "#d1fae5", color: "#065f46", borderRadius: 10, padding: "12px 16px", fontSize: 13, textAlign: "center", fontWeight: 600 }}>
            ✓ Thank you! We&apos;ll respond within 24 hours.
          </div>
        )}
        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 10, padding: "12px 16px", fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}
      </form>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 16 }}>
        Your information is secure and never shared.
      </p>
    </div>
  );
}
