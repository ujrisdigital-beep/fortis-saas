"use client";

import { useMemo, useState } from "react";

type FieldConfig = {
  name: string;
  type: "text" | "checkbox";
  placeholder: string;
  required?: boolean;
  options?: string[];
};

const ikengaFields: FieldConfig[] = [
  { name: "brandName", type: "text", placeholder: "Brand name", required: true },
  { name: "tagline", type: "text", placeholder: "One sentence that describes your brand", required: true },
  {
    name: "channels",
    type: "checkbox",
    options: ["WhatsApp", "Facebook", "Instagram", "LinkedIn", "Word of mouth", "Other"],
    placeholder: "Where do customers find you?",
  },
  { name: "differentiator", type: "text", placeholder: "What makes you different? (one thing)", required: true },
];

export function FortisInteractiveTools() {
  const [ujuText, setUjuText] = useState("");
  const [ujuResult, setUjuResult] = useState("");
  const [ujuLoading, setUjuLoading] = useState(false);

  const [ikengaValues, setIkengaValues] = useState<Record<string, string>>({
    brandName: "",
    tagline: "",
    differentiator: "",
  });
  const [ikengaChannels, setIkengaChannels] = useState<string[]>([]);
  const [ikengaResult, setIkengaResult] = useState("");
  const [ikengaLoading, setIkengaLoading] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [askText, setAskText] = useState("");
  const [askConcern, setAskConcern] = useState("Payment terms and ownership");
  const [askResult, setAskResult] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  const ikengaTextFields = useMemo(
    () => ikengaFields.filter((field) => field.type === "text"),
    [],
  );

  async function submitUjuCycle() {
    if (!ujuText.trim()) return;
    setUjuLoading(true);
    setUjuResult("");

    try {
      const response = await fetch("/api/uju-cycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessOverview: ujuText }),
      });

      const data = await response.json();
      setUjuResult(JSON.stringify(data.analysis ?? data, null, 2));
    } catch {
      setUjuResult("Unable to run analysis right now.");
    } finally {
      setUjuLoading(false);
    }
  }

  function handleIkengaText(name: string, value: string) {
    setIkengaValues((prev) => ({ ...prev, [name]: value }));
  }

  function toggleChannel(channel: string) {
    setIkengaChannels((prev) => (
      prev.includes(channel) ? prev.filter((entry) => entry !== channel) : [...prev, channel]
    ));
  }

  async function submitIkenga() {
    if (!ikengaValues.brandName || !ikengaValues.tagline || !ikengaValues.differentiator) return;
    setIkengaLoading(true);
    setIkengaResult("");

    try {
      const response = await fetch("/api/ikenga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: ikengaValues.brandName,
          positioning: ikengaValues.tagline,
          channels: ikengaChannels.join(", "),
          differentiators: ikengaValues.differentiator,
        }),
      });

      const data = await response.json();
      setIkengaResult(JSON.stringify(data.analysis ?? data, null, 2));
    } catch {
      setIkengaResult("Unable to run assessment right now.");
    } finally {
      setIkengaLoading(false);
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => {
        setAskText(String(reader.result ?? ""));
      };
      reader.readAsText(file);
      return;
    }

    setAskText((prev) => prev || `Uploaded file: ${file.name}. Add text or key clauses for deeper review.`);
  }

  async function submitAskUjris() {
    if (!askText.trim()) return;
    setAskLoading(true);
    setAskResult("");

    try {
      const response = await fetch("/api/ask-ujris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: uploadedFileName ? "Uploaded document" : "Manual text",
          concern: askConcern,
          documentText: askText,
        }),
      });

      const data = await response.json();
      setAskResult(JSON.stringify(data.analysis ?? data, null, 2));
    } catch {
      setAskResult("Unable to analyze document right now.");
    } finally {
      setAskLoading(false);
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={gridStyle}>
        <article className="fortis-card" style={panelStyle}>
          <div style={panelHeaderCenterStyle}>
            <div style={iconStyle}>UJU</div>
            <h2 style={panelTitleStyle}>UJU Cycle - Business Transformation</h2>
            <p style={panelSubtitleStyle}>60 seconds to your AI analysis</p>
          </div>

          <textarea
            value={ujuText}
            onChange={(event) => setUjuText(event.target.value)}
            placeholder="Tell us about your business... Example: 'Jallow Trading - import/export in Serrekunda. 12 employees. We use WhatsApp for orders and Excel for inventory. Our biggest problem is tracking payments. We want to grow to 50 customers this year.'"
            rows={4}
            style={textareaStyle}
          />

          <button type="button" onClick={submitUjuCycle} style={buttonStyle} disabled={ujuLoading}>
            {ujuLoading ? "Analyzing..." : "Analyze My Business"}
          </button>

          <p style={tinyNoteStyle}>No signup required | Results in 30 seconds | First analysis free</p>
          {ujuResult ? <pre style={resultStyle}>{ujuResult}</pre> : null}
        </article>

        <article className="fortis-card" style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Ikenga - Brand Intelligence</h2>
            <p style={panelSubtitleStyle}>Structured field capture for rapid brand assessment</p>
          </div>

          {ikengaTextFields.map((field) => (
            <input
              key={field.name}
              type="text"
              value={ikengaValues[field.name] ?? ""}
              onChange={(event) => handleIkengaText(field.name, event.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              style={inputStyle}
            />
          ))}

          <div style={checkboxWrapStyle}>
            <p style={checkboxLabelStyle}>{ikengaFields.find((field) => field.name === "channels")?.placeholder}</p>
            <div style={checkboxGridStyle}>
              {(ikengaFields.find((field) => field.name === "channels")?.options ?? []).map((option) => (
                <label key={option} style={checkboxItemStyle}>
                  <input
                    type="checkbox"
                    checked={ikengaChannels.includes(option)}
                    onChange={() => toggleChannel(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="button" onClick={submitIkenga} style={buttonStyle} disabled={ikengaLoading}>
            {ikengaLoading ? "Assessing..." : "Run Ikenga Assessment"}
          </button>

          {ikengaResult ? <pre style={resultStyle}>{ikengaResult}</pre> : null}
        </article>

        <article className="fortis-card" style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Ask UJRIS - Document Forensics</h2>
            <p style={panelSubtitleStyle}>Upload and review contracts, letters, and policy text</p>
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            style={inputStyle}
          />
          <p style={tinyHintStyle}>Or take a photo of the document</p>

          <input
            type="text"
            value={askConcern}
            onChange={(event) => setAskConcern(event.target.value)}
            placeholder="Main concern"
            style={inputStyle}
          />

          <textarea
            value={askText}
            onChange={(event) => setAskText(event.target.value)}
            placeholder="Paste document text or key clauses to analyze"
            rows={5}
            style={textareaStyle}
          />

          <button type="button" onClick={submitAskUjris} style={buttonStyle} disabled={askLoading}>
            {askLoading ? "Analyzing..." : "Analyze Document"}
          </button>

          {askResult ? <pre style={resultStyle}>{askResult}</pre> : null}
        </article>
      </div>
    </section>
  );
}

const sectionStyle: React.CSSProperties = {
  marginTop: "1rem",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const panelStyle: React.CSSProperties = {
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  minHeight: "520px",
};

const panelHeaderStyle: React.CSSProperties = {
  marginBottom: "0.2rem",
};

const panelHeaderCenterStyle: React.CSSProperties = {
  marginBottom: "0.2rem",
  textAlign: "center",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
};

const panelSubtitleStyle: React.CSSProperties = {
  margin: "0.35rem 0 0",
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.86rem",
};

const iconStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "999px",
  margin: "0 auto 0.6rem",
  display: "grid",
  placeItems: "center",
  background: "rgba(255, 215, 0, 0.15)",
  color: "#FFD700",
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "rgba(0, 0, 0, 0.22)",
  color: "#FFFFFF",
  borderRadius: "0.7rem",
  padding: "0.78rem 0.86rem",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "120px",
};

const buttonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: "0.72rem",
  padding: "0.85rem 1rem",
  color: "#FFFFFF",
  fontWeight: 800,
  background: "#2E7D32",
  cursor: "pointer",
};

const tinyNoteStyle: React.CSSProperties = {
  margin: 0,
  textAlign: "center",
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.56)",
};

const tinyHintStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.62)",
};

const checkboxWrapStyle: React.CSSProperties = {
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "0.7rem",
  padding: "0.7rem",
};

const checkboxLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.85rem",
  color: "rgba(255,255,255,0.7)",
};

const checkboxGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.45rem",
  marginTop: "0.65rem",
};

const checkboxItemStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.84rem",
};

const resultStyle: React.CSSProperties = {
  margin: 0,
  marginTop: "0.3rem",
  padding: "0.7rem",
  borderRadius: "0.7rem",
  border: "1px solid rgba(255, 215, 0, 0.22)",
  background: "rgba(0, 0, 0, 0.25)",
  maxHeight: "180px",
  overflow: "auto",
  fontSize: "0.73rem",
  lineHeight: 1.4,
  whiteSpace: "pre-wrap",
};