"use client";
import { useState, useEffect } from "react";

interface LegalDisclaimerProps {
  toolName: "ask-ujris" | "ikenga" | "uju-cycle" | "marketplace";
  onAccept?: () => void;
}

const DISCLAIMER_KEY = (tool: string) => `fortis_disclaimer_${tool}_accepted`;

const DISCLAIMERS: Record<string, { title: string; content: string; lawReferences: string[] }> = {
  "ask-ujris": {
    title: "Ask UJRIS™ — Legal Disclaimer",
    content:
      "Ask UJRIS provides AI-powered document analysis for informational purposes only. It does not constitute legal advice. FORTIS OS is not a law firm. Users should consult qualified legal professionals for legal opinions. By using this tool, you confirm that you are not submitting documents containing third-party confidential information without authorisation.",
    lawReferences: ["Gambia Data Protection Act 2018", "Electronic Transactions Act 2019", "Cybercrime Act 2021"],
  },
  ikenga: {
    title: "IKENGA™ — Content Disclaimer",
    content:
      "IKENGA generates content using AI. Users are responsible for ensuring generated content complies with applicable laws including the Gambia Copyright Act 2004 and Cybercrime Act 2021. FORTIS OS does not guarantee that generated content is free from copyright infringement. Review and verify all content before publishing.",
    lawReferences: ["Gambia Copyright Act 2004", "Cybercrime Act 2021"],
  },
  "uju-cycle": {
    title: "UJU Cycle™ — Business Analysis Disclaimer",
    content:
      "UJU Cycle provides AI-generated business transformation suggestions for informational purposes. Business decisions should be validated with qualified professionals. FORTIS OS is not liable for outcomes resulting from implementation of AI-generated recommendations.",
    lawReferences: ["Companies Act 2013", "Consumer Protection Act 2014"],
  },
  marketplace: {
    title: "FORTIS Marketplace — Legal Notice",
    content:
      "FORTIS OS acts as an intermediary platform connecting buyers and sellers. All transactions are between buyers and sellers. Escrow services are provided under the User Agreement. Disputes are resolved in accordance with the Consumer Protection Act 2014.",
    lawReferences: ["Consumer Protection Act 2014", "Electronic Transactions Act 2019"],
  },
};

export default function LegalDisclaimer({ toolName, onAccept }: LegalDisclaimerProps) {
  const [show, setShow] = useState(false);
  const disclaimer = DISCLAIMERS[toolName] ?? DISCLAIMERS["ask-ujris"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem(DISCLAIMER_KEY(toolName));
    if (!accepted) setShow(true);
  }, [toolName]);

  function accept() {
    localStorage.setItem(DISCLAIMER_KEY(toolName), "true");
    setShow(false);
    onAccept?.();
  }

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 99998, padding: "1rem",
    }}>
      <div style={{
        background: "#FFFFFF", borderRadius: 16, maxWidth: 560, width: "100%",
        padding: "2rem", boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <span style={{ fontSize: 28 }}>⚖️</span>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0F3D21" }}>{disclaimer.title}</h2>
        </div>

        <div style={{ background: "#F0F4F0", borderRadius: 10, padding: "1rem", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151", lineHeight: 1.7 }}>{disclaimer.content}</p>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.8rem", color: "#1B4D3E" }}>Relevant Gambian Laws:</p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {disclaimer.lawReferences.map((law) => (
              <li key={law} style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "0.2rem" }}>{law}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={accept}
            style={{
              flex: 1, padding: "0.75rem", background: "#C4943A", color: "#0F3D21",
              border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            I Understand & Accept
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "0.75rem 1.25rem", background: "#F3F4F6", color: "#374151",
              border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>

        <p style={{ margin: "1rem 0 0", fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center" }}>
          FORTIS OS™ is operated by FORTIS INVICTA LTD in The Gambia. Acceptance is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
