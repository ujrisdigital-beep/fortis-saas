"use client";

import { useState } from "react";

type StarRatingProps = {
  onSubmit: (rating: number, feedback: string) => void;
  tool: string;
  submitted?: boolean;
};

export function StarRating({ onSubmit, tool, submitted }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(submitted ?? false);

  function handleSubmit() {
    if (selected === 0) return;
    onSubmit(selected, feedback);
    setDone(true);
  }

  if (done) {
    return (
      <div style={doneStyle}>
        <span style={checkStyle}>✓</span>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-primary)", fontWeight: 600 }}>
          Thank you! Your feedback helps improve {tool}.
        </p>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <p style={labelStyle}>Was this analysis helpful?</p>
      <div style={starsRowStyle}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setSelected(star)}
            style={{
              ...starBtnStyle,
              color: star <= (hover || selected) ? "#D4AF37" : "#CBD5E1",
              transform: star <= (hover || selected) ? "scale(1.15)" : "scale(1)",
            }}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
        {selected > 0 && (
          <span style={selectedLabelStyle}>{LABELS[selected - 1]}</span>
        )}
      </div>
      {selected > 0 && (
        <>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional: what would make this better?"
            rows={2}
            className="fortis-textarea"
            style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}
          />
          <button type="button" className="btn-primary" onClick={handleSubmit} style={{ marginTop: "0.5rem", fontSize: "0.85rem", padding: "0.6rem 1.25rem" }}>
            Submit Feedback
          </button>
        </>
      )}
    </div>
  );
}

const LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const wrapStyle: React.CSSProperties = {
  padding: "1.25rem", background: "var(--color-card-bg)",
  border: "1px solid var(--color-border)", borderRadius: "0.75rem",
  marginTop: "1.25rem",
};
const labelStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text)" };
const starsRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.2rem" };
const starBtnStyle: React.CSSProperties = {
  background: "none", border: "none", fontSize: "1.6rem",
  cursor: "pointer", padding: "0", transition: "transform 0.1s, color 0.1s",
  lineHeight: 1,
};
const selectedLabelStyle: React.CSSProperties = { marginLeft: "0.5rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-muted)" };
const doneStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "0.75rem",
  padding: "0.875rem 1.25rem", background: "#f0fdf4",
  border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0.75rem",
  marginTop: "1.25rem",
};
const checkStyle: React.CSSProperties = {
  width: "24px", height: "24px", borderRadius: "50%",
  background: "#10B981", color: "#FFFFFF", fontWeight: 800,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: "0.8rem", flexShrink: 0,
};
