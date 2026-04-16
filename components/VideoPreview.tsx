"use client";
// components/VideoPreview.tsx
// Canvas-based post preview with audio generation (NotebookLM-style)
import { useRef, useEffect, useState, useCallback } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const WHITE   = "#FFFFFF";
const DARK    = "#0F3D21";

interface VideoPreviewProps {
  caption: string;
  platform: string;
  hashtags: string[];
  hook?: string;
  brandName?: string;
  onClose: () => void;
}

interface PlatformDim {
  width: number;
  height: number;
  bg: string;
  textColor: string;
  label: string;
  accentColor: string;
}

const PLATFORM_DIMS: Record<string, PlatformDim> = {
  tiktok:    { width: 360, height: 640,  bg: "#000000", textColor: "#FFFFFF", label: "TikTok",    accentColor: "#69C9D0" },
  instagram: { width: 540, height: 540,  bg: "#FFFFFF", textColor: "#000000", label: "Instagram", accentColor: "#E1306C" },
  youtube:   { width: 640, height: 360,  bg: "#0F0F0F", textColor: "#FFFFFF", label: "YouTube",   accentColor: "#FF0000" },
  facebook:  { width: 600, height: 315,  bg: "#1877F2", textColor: "#FFFFFF", label: "Facebook",  accentColor: "#FFFFFF" },
  linkedin:  { width: 600, height: 315,  bg: "#0A66C2", textColor: "#FFFFFF", label: "LinkedIn",  accentColor: "#FFFFFF" },
  twitter:   { width: 600, height: 335,  bg: "#000000", textColor: "#FFFFFF", label: "X / Twitter", accentColor: "#FFFFFF" },
  threads:   { width: 540, height: 540,  bg: "#101010", textColor: "#FFFFFF", label: "Threads",   accentColor: "#FFFFFF" },
  default:   { width: 600, height: 315,  bg: PRIMARY,   textColor: "#FFFFFF", label: "Post",      accentColor: GOLD },
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 6
): number {
  const words = text.split(" ");
  let line = "";
  let linesDrawn = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + " ";
      y += lineHeight;
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + "…", x, y);
        return y;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
}

export default function VideoPreview({
  caption, platform, hashtags, hook, brandName = "FORTIS OS", onClose,
}: VideoPreviewProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [audioUrl,    setAudioUrl]    = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioMock,    setAudioMock]    = useState("");
  const [copied,       setCopied]       = useState(false);

  const dim = PLATFORM_DIMS[platform] ?? PLATFORM_DIMS.default;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = dim.width;
    canvas.height = dim.height;

    // Background
    ctx.fillStyle = dim.bg;
    ctx.fillRect(0, 0, dim.width, dim.height);

    // Gambia gold top stripe
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, 0, dim.width, 6);

    // Platform label (top-left)
    ctx.fillStyle = dim.accentColor;
    ctx.font = `bold ${Math.round(dim.width / 30)}px 'DM Sans', system-ui, sans-serif`;
    ctx.fillText(dim.label.toUpperCase(), 20, 32);

    // Brand watermark (top-right)
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `${Math.round(dim.width / 40)}px 'DM Sans', system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(brandName, dim.width - 16, 32);
    ctx.textAlign = "left";

    // Hook line
    if (hook) {
      const hookSize = Math.round(dim.width / 18);
      ctx.fillStyle = GOLD;
      ctx.font = `bold ${hookSize}px 'DM Sans', system-ui, sans-serif`;
      wrapText(ctx, hook, 20, Math.round(dim.height * 0.30), dim.width - 40, hookSize * 1.3, 2);
    }

    // Caption body
    const captionSize = Math.round(dim.width / 26);
    ctx.fillStyle = dim.textColor;
    ctx.font = `${captionSize}px 'DM Sans', system-ui, sans-serif`;
    const captionY = hook ? Math.round(dim.height * 0.46) : Math.round(dim.height * 0.32);
    wrapText(ctx, caption, 20, captionY, dim.width - 40, captionSize * 1.6, 5);

    // Hashtags
    const tagSize = Math.round(dim.width / 34);
    ctx.fillStyle = dim.accentColor;
    ctx.font = `bold ${tagSize}px 'DM Sans', system-ui, sans-serif`;
    const tagText = hashtags.slice(0, 5).map(t => `#${t.replace(/^#/, "")}`).join("  ");
    ctx.fillText(tagText, 20, dim.height - 32);

    // FI emblem (bottom-right)
    const emblemSize = Math.round(dim.width / 14);
    ctx.fillStyle = PRIMARY;
    ctx.beginPath();
    ctx.arc(dim.width - emblemSize / 2 - 14, dim.height - emblemSize / 2 - 14, emblemSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.font = `bold ${Math.round(emblemSize * 0.45)}px 'Cormorant Garamond', Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText("FI", dim.width - emblemSize / 2 - 14, dim.height - emblemSize / 2 - 10);
    ctx.textAlign = "left";

    // Gambia flag accent stripe (bottom)
    const stripeH = 5;
    ctx.fillStyle = "#3A7D44"; ctx.fillRect(0, dim.height - stripeH, dim.width / 3, stripeH);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(dim.width / 3, dim.height - stripeH, dim.width / 3, stripeH);
    ctx.fillStyle = "#E63946"; ctx.fillRect((dim.width / 3) * 2, dim.height - stripeH, dim.width / 3, stripeH);
  }, [caption, platform, hashtags, hook, brandName, dim]);

  useEffect(() => { draw(); }, [draw]);

  async function handleAudio() {
    setAudioLoading(true);
    setAudioMock("");
    try {
      const text = [hook, caption, hashtags.map(t => `#${t}`).join(" ")].filter(Boolean).join(". ");
      const res  = await fetch("/api/audio/summary", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
      } else {
        setAudioMock(data.mock ?? "Audio preview: " + text.slice(0, 100));
      }
    } catch {
      setAudioMock("Audio service unavailable. Add ELEVENLABS_API_KEY to enable voiceover.");
    } finally {
      setAudioLoading(false);
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link    = document.createElement("a");
    link.download = `fortis-${platform}-preview.png`;
    link.href     = canvas.toDataURL("image/png");
    link.click();
  }

  function handleCopy() {
    const text = [hook, caption, hashtags.map(t => `#${t}`).join(" ")].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Scale canvas to fit modal
  const scale   = Math.min(560 / dim.width, 400 / dim.height);
  const dispW   = Math.round(dim.width  * scale);
  const dispH   = Math.round(dim.height * scale);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(10,28,46,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1.5rem", backdropFilter: "blur(6px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: WHITE, borderRadius: 14, width: "100%", maxWidth: 640,
        boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: PRIMARY, padding: "0.9rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎬</span>
            <div>
              <div style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}>
                Post Preview — {dim.label}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                {dim.width} × {dim.height}px · Gambia Green design
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.12)", border: "none", color: WHITE,
            borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 14,
          }}>✕</button>
        </div>

        {/* Canvas preview */}
        <div style={{
          background: "#111", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "1.5rem",
        }}>
          <canvas
            ref={canvasRef}
            style={{
              width: dispW, height: dispH,
              borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              imageRendering: "crisp-edges",
            }}
          />
        </div>

        {/* Audio bar */}
        {audioUrl && (
          <div style={{ padding: "0 1.25rem" }}>
            <audio controls src={audioUrl} style={{ width: "100%", marginTop: 8 }} />
          </div>
        )}
        {audioMock && (
          <div style={{
            margin: "0 1.25rem", padding: "0.65rem 0.9rem",
            background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.15)",
            borderRadius: 8, fontSize: 12, color: PRIMARY,
          }}>
            🔊 {audioMock}
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          padding: "1rem 1.25rem", display: "flex", gap: 8, flexWrap: "wrap",
          borderTop: "1px solid #E2E8F0",
        }}>
          <button onClick={handleAudio} disabled={audioLoading} style={{
            padding: "0.55rem 1rem", background: PRIMARY, color: WHITE,
            border: "none", borderRadius: 7, fontWeight: 700, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            {audioLoading ? "⏳ Generating…" : "🔊 Voiceover"}
          </button>
          <button onClick={handleDownload} style={{
            padding: "0.55rem 1rem", background: GOLD, color: DARK,
            border: "none", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            📸 Download PNG
          </button>
          <button onClick={handleCopy} style={{
            padding: "0.55rem 1rem",
            background: copied ? "#16A34A" : WHITE,
            color: copied ? WHITE : PRIMARY,
            border: `1.5px solid ${copied ? "#16A34A" : "#E2E8F0"}`,
            borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            {copied ? "✓ Copied" : "📋 Copy Text"}
          </button>
          <button onClick={onClose} style={{
            marginLeft: "auto", padding: "0.55rem 1rem",
            background: "transparent", color: "#6B7280",
            border: "1px solid #E2E8F0", borderRadius: 7, fontSize: 13, cursor: "pointer",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
