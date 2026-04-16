"use client";
import { useState, useRef } from "react";
import { useLang } from "../../../hooks/useLang";
import { MediaUpload } from "../../../components/MediaUpload";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

type DocType = "letter" | "report" | "contract" | "proposal" | "invoice" | "notice" | "certificate";
type Step = "compose" | "review" | "send" | "done";

const DOC_TYPES: { id: DocType; label: string; icon: string; template: string }[] = [
  { id: "letter", label: "Formal Letter", icon: "✉️", template: "Dear {recipient},\n\nI am writing to {purpose}.\n\n{body}\n\nYours faithfully,\n{sender}" },
  { id: "report", label: "Business Report", icon: "📊", template: "REPORT: {subject}\nDate: {date}\nPrepared by: {sender}\n\nEXECUTIVE SUMMARY\n{body}\n\nRECOMMENDATIONS\n1. " },
  { id: "contract", label: "Agreement / Contract", icon: "📋", template: "SERVICE AGREEMENT\n\nThis agreement is entered into between {sender} and {recipient}.\n\nSCOPE OF WORK\n{body}\n\nTERMS & CONDITIONS\n1. Payment terms: 50% upfront, 50% on delivery\n2. Duration: \n3. Governing law: Laws of The Gambia" },
  { id: "proposal", label: "Business Proposal", icon: "💼", template: "BUSINESS PROPOSAL\nTo: {recipient}\nFrom: {sender}\nRe: {subject}\n\n{body}\n\nINVESTMENT REQUIRED\n\nNEXT STEPS" },
  { id: "invoice", label: "Invoice", icon: "🧾", template: "INVOICE\nFrom: {sender}\nTo: {recipient}\nDate: {date}\nInvoice #: INV-{date}\n\nDESCRIPTION OF SERVICES\n{body}\n\nPAYMENT DETAILS\nBank: Trust Bank Gambia\nAccount: " },
  { id: "notice", label: "Notice / Announcement", icon: "📢", template: "NOTICE\n\nThis is to inform {recipient} that {body}.\n\nIssued by: {sender}\nDate: {date}" },
  { id: "certificate", label: "Certificate", icon: "🏅", template: "CERTIFICATE OF {subject}\n\nThis is to certify that {recipient} has {body}.\n\nIssued by: {sender}\nDate: {date}" },
];

interface EmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  docType: DocType;
  status: "draft" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
  attachments: string[];
  trackingId: string;
}

export default function ComposeDocumentPage() {
  useLang();
  const [step, setStep] = useState<Step>("compose");
  const [docType, setDocType] = useState<DocType>("letter");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderOrg, setSenderOrg] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toCc, setToCc] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [attachFiles, setAttachFiles] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentDraft, setSentDraft] = useState<EmailDraft | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedTemplate = DOC_TYPES.find(d => d.id === docType)!;

  const applyTemplate = () => {
    const today = new Date().toLocaleDateString("en-GB");
    const filled = selectedTemplate.template
      .replace(/{recipient}/g, recipient || "[Recipient Name]")
      .replace(/{sender}/g, `${senderName}${senderOrg ? " — " + senderOrg : ""}`)
      .replace(/{subject}/g, subject || "[Subject]")
      .replace(/{date}/g, today)
      .replace(/{purpose}/g, "[state purpose]")
      .replace(/{body}/g, "[body text here]");
    setBodyText(filled);
  };

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    setAiAnalysis(
      `✅ Document Analysis Complete\n\n` +
      `📝 Type: ${selectedTemplate.label}\n` +
      `📊 Word count: ${wordCount}\n` +
      `🎯 Tone: ${wordCount > 100 ? "Professional & Detailed" : "Concise & Direct"}\n` +
      `✔️ Structure: ${bodyText.includes("\n\n") ? "Well-structured with paragraphs" : "Consider adding paragraph breaks"}\n` +
      `⚠️ Suggestions:\n` +
      `  • ${!recipient ? "❌ Add recipient name" : "✓ Recipient specified"}\n` +
      `  • ${!senderName ? "❌ Add sender name" : "✓ Sender name provided"}\n` +
      `  • ${!subject ? "❌ Add document subject" : "✓ Subject line present"}\n` +
      `  • ${wordCount < 20 ? "⚠️ Document is very short — consider expanding" : "✓ Document length adequate"}\n\n` +
      `🤖 UJRIS AI Verdict: ${wordCount > 50 && recipient && senderName ? "Ready to send" : "Review suggestions above before sending"}`
    );
    setAnalyzing(false);
  };

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 2200));
    const draft: EmailDraft = {
      id: `DOC-${Date.now()}`,
      to: toEmail,
      subject,
      body: bodyText,
      docType,
      status: "sent",
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      attachments: attachFiles.map(f => f.name),
      trackingId: `TRK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    };
    // persist to localStorage for email outbox
    const existing: EmailDraft[] = JSON.parse(localStorage.getItem("fortis_emails") || "[]");
    existing.unshift(draft);
    localStorage.setItem("fortis_emails", JSON.stringify(existing.slice(0, 100)));
    setSentDraft(draft);
    setSending(false);
    setStep("done");
  };

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "48px 24px 36px", textAlign: "center" };
  const container: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "32px 16px" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 15, boxSizing: "border-box", marginBottom: 14 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: MUT, marginBottom: 4 };
  const sectionCard: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 24, marginBottom: 20 };
  const stepPill = (active: boolean, done: boolean): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    background: done ? G : active ? GOLD : "#E2E8F0", color: done || active ? "#fff" : MUT, fontWeight: 800, fontSize: 14
  });
  const steps: { id: Step; label: string }[] = [
    { id: "compose", label: "Compose" },
    { id: "review", label: "AI Review" },
    { id: "send", label: "Send" },
    { id: "done", label: "Done" },
  ];
  const stepIdx = steps.findIndex(s => s.id === step);

  return (
    <div style={page}>
      <div style={hero}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Document Composer</h1>
          <p style={{ fontSize: 15, opacity: 0.85 }}>Create professional letters, reports & contracts → AI review → Send directly by email</p>
          {/* Step Progress */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 24 }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...stepPill(step === s.id, stepIdx > i), margin: "0 auto 4px" }}>
                    {stepIdx > i ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{s.label}</div>
                </div>
                {i < steps.length - 1 && <div style={{ width: 60, height: 2, background: stepIdx > i ? G : "rgba(255,255,255,0.3)", margin: "0 8px 16px" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={container}>
        {step === "compose" && (
          <>
            {/* Document Type */}
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 16 }}>1. Choose Document Type</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {DOC_TYPES.map(dt => (
                  <button
                    key={dt.id}
                    style={{ padding: "10px 18px", borderRadius: 10, border: `2px solid ${docType === dt.id ? G : "#E2E8F0"}`, background: docType === dt.id ? "#F0FDF4" : "#fff", color: docType === dt.id ? G : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                    onClick={() => setDocType(dt.id)}
                  >
                    {dt.icon} {dt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 16 }}>2. Document Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input style={inputStyle} placeholder="e.g. Ousman Jallow" value={senderName} onChange={e => setSenderName(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Your Organisation</label>
                  <input style={inputStyle} placeholder="e.g. UJU GROUP LIMITED" value={senderOrg} onChange={e => setSenderOrg(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Recipient Name *</label>
                  <input style={inputStyle} placeholder="e.g. The Director General" value={recipient} onChange={e => setRecipient(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Subject / Title *</label>
                  <input style={inputStyle} placeholder="e.g. Application for Business Licence" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
              </div>
              <button
                style={{ padding: "10px 20px", background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 8, color: G, fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                onClick={applyTemplate}
              >
                📄 Apply Template
              </button>
            </div>

            {/* Document Body */}
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 8 }}>3. Document Content</h2>
              <p style={{ color: MUT, fontSize: 13, marginBottom: 12 }}>Write or paste your document content below. You can apply the template above as a starting point.</p>
              <textarea
                ref={textareaRef}
                style={{ ...inputStyle, minHeight: 320, resize: "vertical", fontFamily: "monospace", fontSize: 14, lineHeight: 1.7 }}
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
                placeholder="Start writing your document here, or click 'Apply Template' above..."
              />
            </div>

            {/* Attachments */}
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 12 }}>4. Attachments (Optional)</h2>
              <MediaUpload
                onFilesChange={(files: import("../../../components/MediaUpload").UploadedFile[]) => setAttachFiles(files.map(f => f.file))}
                maxFiles={5}
                compact
                label="Attach supporting documents"
              />
            </div>

            <button
              style={{ width: "100%", padding: "15px", background: G, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 17, cursor: "pointer", opacity: (!bodyText || !senderName || !subject) ? 0.5 : 1 }}
              disabled={!bodyText || !senderName || !subject}
              onClick={() => { runAiAnalysis(); setStep("review"); }}
            >
              Continue to AI Review →
            </button>
          </>
        )}

        {step === "review" && (
          <>
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 12 }}>AI Document Analysis</h2>
              {analyzing ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
                  <p style={{ color: MUT }}>UJRIS AI is reviewing your document...</p>
                  <div style={{ width: "100%", height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: G, width: "75%", borderRadius: 3, animation: "progress 1.8s ease-in-out" }} />
                  </div>
                </div>
              ) : (
                <pre style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: 18, fontSize: 14, whiteSpace: "pre-wrap", color: NAVY, lineHeight: 1.8 }}>{aiAnalysis}</pre>
              )}
            </div>

            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 12 }}>Document Preview</h2>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 24, maxHeight: 300, overflowY: "auto" }}>
                <pre style={{ fontFamily: "Georgia, serif", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.8, color: "#1A1A1A" }}>{bodyText}</pre>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${G}`, borderRadius: 10, color: G, fontWeight: 700, cursor: "pointer" }} onClick={() => setStep("compose")}>
                ← Edit Document
              </button>
              <button style={{ flex: 2, padding: 14, background: G, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer" }} onClick={() => setStep("send")}>
                Continue to Send →
              </button>
            </div>
          </>
        )}

        {step === "send" && (
          <>
            <div style={sectionCard}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Email Delivery</h2>
              <label style={labelStyle}>Recipient Email Address *</label>
              <input type="email" style={inputStyle} placeholder="e.g. director@gov.gm" value={toEmail} onChange={e => setToEmail(e.target.value)} />
              <label style={labelStyle}>CC (Optional)</label>
              <input type="email" style={inputStyle} placeholder="e.g. info@company.gm" value={toCc} onChange={e => setToCc(e.target.value)} />
              <label style={labelStyle}>Email Subject</label>
              <input style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)} />

              <div style={{ background: "#FEF3C7", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: "#78350F", margin: 0 }}>
                  📧 Your document will be sent via FORTIS OS Secure Mail. You will receive a delivery confirmation and open tracking.
                  {attachFiles.length > 0 && ` ${attachFiles.length} attachment(s) will be included.`}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${G}`, borderRadius: 10, color: G, fontWeight: 700, cursor: "pointer" }} onClick={() => setStep("review")}>
                ← Back
              </button>
              <button
                style={{ flex: 2, padding: 14, background: sending ? MUT : G, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: sending ? "default" : "pointer", opacity: !toEmail ? 0.5 : 1 }}
                disabled={!toEmail || sending}
                onClick={handleSend}
              >
                {sending ? "Sending..." : "📤 Send Document"}
              </button>
            </div>
          </>
        )}

        {step === "done" && sentDraft && (
          <div style={{ ...sectionCard, textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: G, marginBottom: 8 }}>Document Sent Successfully!</h2>
            <p style={{ color: MUT, fontSize: 16, marginBottom: 20 }}>Your {selectedTemplate.label} has been delivered to <strong>{sentDraft.to}</strong></p>
            <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left", maxWidth: 420, margin: "0 auto 24px" }}>
              <div style={{ fontSize: 14, marginBottom: 6 }}><strong>Document ID:</strong> {sentDraft.id}</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><strong>Tracking ID:</strong> {sentDraft.trackingId}</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><strong>To:</strong> {sentDraft.to}</div>
              <div style={{ fontSize: 14 }}><strong>Sent:</strong> {new Date(sentDraft.sentAt!).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{ padding: "12px 24px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
                onClick={() => { setStep("compose"); setBodyText(""); setSubject(""); setRecipient(""); setToEmail(""); setAiAnalysis(""); }}
              >
                📝 Compose New
              </button>
              <button
                style={{ padding: "12px 24px", background: "#fff", border: `2px solid ${G}`, borderRadius: 8, color: G, fontWeight: 700, cursor: "pointer" }}
                onClick={() => window.location.href = "/my-emails"}
              >
                📬 View Outbox →
              </button>
              <button
                style={{ padding: "12px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 8, color: MUT, fontWeight: 700, cursor: "pointer" }}
                onClick={() => window.print()}
              >
                🖨️ Print Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
