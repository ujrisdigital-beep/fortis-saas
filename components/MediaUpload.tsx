"use client";

import { useState, useRef, useCallback } from "react";

export type UploadedFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  status: "pending" | "processing" | "done" | "error";
  extractedText?: string;
  preview?: string;
  error?: string;
};

type FileCategory =
  | "document" | "image" | "audio" | "video" | "archive" | "other";

const ACCEPT_ALL = [
  // Documents
  ".pdf",".doc",".docx",".txt",".rtf",".odt",".html",".xml",".json",".csv",".xls",".xlsx",
  // Images
  ".jpg",".jpeg",".png",".gif",".webp",".bmp",".tiff",".tif",".svg",".heic",".heif",
  // Audio
  ".mp3",".wav",".ogg",".m4a",".aac",".flac",".wma",
  // Video
  ".mp4",".webm",".avi",".mov",".mkv",".wmv",".flv",
  // Archives
  ".zip",".rar",".7z",".tar",".gz",".bz2",".tgz",
].join(",");

const TYPE_MAP: Record<string, { category: FileCategory; icon: string; color: string }> = {
  // Documents
  "application/pdf":                              { category: "document", icon: "📄", color: "#e74c3c" },
  "application/msword":                          { category: "document", icon: "📝", color: "#2b579a" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { category: "document", icon: "📝", color: "#2b579a" },
  "text/plain":                                   { category: "document", icon: "📃", color: "#64748B" },
  "text/csv":                                     { category: "document", icon: "📊", color: "#1B4D3E" },
  "application/json":                             { category: "document", icon: "📋", color: "#D4AF37" },
  "application/vnd.ms-excel":                    { category: "document", icon: "📊", color: "#217346" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { category: "document", icon: "📊", color: "#217346" },
  // Images
  "image/jpeg":   { category: "image", icon: "🖼️", color: "#8B5CF6" },
  "image/png":    { category: "image", icon: "🖼️", color: "#8B5CF6" },
  "image/gif":    { category: "image", icon: "🎞️", color: "#8B5CF6" },
  "image/webp":   { category: "image", icon: "🖼️", color: "#8B5CF6" },
  "image/svg+xml":{ category: "image", icon: "🎨", color: "#8B5CF6" },
  // Audio
  "audio/mpeg":   { category: "audio", icon: "🎵", color: "#F59E0B" },
  "audio/wav":    { category: "audio", icon: "🎵", color: "#F59E0B" },
  "audio/ogg":    { category: "audio", icon: "🎵", color: "#F59E0B" },
  "audio/mp4":    { category: "audio", icon: "🎵", color: "#F59E0B" },
  // Video
  "video/mp4":    { category: "video", icon: "🎬", color: "#EC4899" },
  "video/webm":   { category: "video", icon: "🎬", color: "#EC4899" },
  "video/quicktime":{ category: "video", icon: "🎬", color: "#EC4899" },
  // Archives
  "application/zip":          { category: "archive", icon: "🗜️", color: "#0A1C2E" },
  "application/x-rar-compressed": { category: "archive", icon: "🗜️", color: "#0A1C2E" },
  "application/x-7z-compressed":  { category: "archive", icon: "🗜️", color: "#0A1C2E" },
};

function getFileMeta(file: File) {
  const mapped = TYPE_MAP[file.type];
  if (mapped) return mapped;
  if (file.type.startsWith("image/")) return { category: "image" as FileCategory, icon: "🖼️", color: "#8B5CF6" };
  if (file.type.startsWith("audio/")) return { category: "audio" as FileCategory, icon: "🎵", color: "#F59E0B" };
  if (file.type.startsWith("video/")) return { category: "video" as FileCategory, icon: "🎬", color: "#EC4899" };
  return { category: "other" as FileCategory, icon: "📎", color: "#64748B" };
}

function fmtBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

const PROC_MESSAGES: Record<FileCategory, string> = {
  document: "Extracting text…",
  image:    "Running OCR text extraction…",
  audio:    "Transcribing audio…",
  video:    "Extracting audio & transcribing…",
  archive:  "Extracting archive contents…",
  other:    "Processing file…",
};

const DONE_MESSAGES: Record<FileCategory, string> = {
  document: "Text extracted",
  image:    "OCR complete",
  audio:    "Transcription complete",
  video:    "Transcription complete",
  archive:  "Archive extracted",
  other:    "File processed",
};

/** Simulate processing: real implementation calls /api/process-file */
async function simulateProcess(file: UploadedFile): Promise<Partial<UploadedFile>> {
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1000));
  const samples: Record<FileCategory, string> = {
    document: `[Extracted from ${file.name}]\n\nThis document contains business registration details, financial projections, and operational guidelines relevant to UJU GROUP LIMITED operations in The Gambia.\n\nKey sections: Executive Summary, Market Analysis, Financial Model, Risk Assessment.`,
    image:    `[OCR from ${file.name}]\n\nText detected: "UJU GROUP LIMITED — Business Certificate No. GM-2024-8821. Registered: Serrekunda, Kanifing Municipal Council. Director: [Name]. Valid until: December 2026."`,
    audio:    `[Transcription of ${file.name}]\n\n"Good morning, this is a voice note regarding the quarterly review meeting. The agenda covers sales performance for Q1 2026, the expansion plan for the Upper River Region, and partnership discussions with GIEPA."`,
    video:    `[Transcript of ${file.name}]\n\n[0:00] Welcome to the Fortis OS product demonstration.\n[0:15] Today we'll walk through the key features of the platform.\n[0:45] Starting with the AI-powered brand analysis tool, Ikenga…`,
    archive:  `[Contents of ${file.name}]\n\nFiles extracted: financial_report_Q1.pdf, business_plan_2026.docx, contact_list.xlsx, photos/ (12 images), certificates/ (3 PDFs)`,
    other:    `[Processed: ${file.name}]\n\nFile received and stored. Size: ${fmtBytes(file.size)}. Type: ${file.type || "unknown"}.`,
  };
  return {
    status: "done",
    extractedText: samples[file.category],
  };
}

type Props = {
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  compact?: boolean;
  label?: string;
};

export function MediaUpload({ onFilesChange, maxFiles = 10, compact = false, label }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).slice(0, maxFiles - files.length);
    const newEntries: UploadedFile[] = arr.map((f) => {
      const meta = getFileMeta(f);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        category: meta.category,
        status: "pending",
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      };
    });

    const withProcessing = newEntries.map((e) => ({ ...e, status: "processing" as const }));
    setFiles((prev) => {
      const updated = [...prev, ...withProcessing];
      onFilesChange?.(updated);
      return updated;
    });

    // Process each file
    for (const entry of withProcessing) {
      const result = await simulateProcess(entry);
      setFiles((prev) => {
        const updated = prev.map((f) => f.id === entry.id ? { ...f, ...result } : f);
        onFilesChange?.(updated);
        return updated;
      });
    }
  }, [files.length, maxFiles, onFilesChange]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" });
        addFiles([file]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch {
      alert("Microphone access denied. Please allow microphone permissions.");
    }
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setRecording(false);
    setMediaRecorder(null);
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesChange?.(updated);
      return updated;
    });
  }

  const statusColor = (s: UploadedFile["status"]) =>
    s === "done" ? "#065f46" : s === "error" ? "#991b1b" : s === "processing" ? "#92400e" : "#475569";
  const statusBg = (s: UploadedFile["status"]) =>
    s === "done" ? "#dcfce7" : s === "error" ? "#fee2e2" : s === "processing" ? "#fef3c7" : "#f1f5f9";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {label && <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#0A1C2E" }}>{label}</p>}

      {/* Drop zone */}
      <div
        style={{
          border: `2px dashed ${dragging ? "#1B4D3E" : "#E2E8F0"}`,
          borderRadius: "0.85rem",
          padding: compact ? "1rem" : "2rem 1.5rem",
          textAlign: "center",
          background: dragging ? "rgba(27,77,62,0.04)" : "#FAFAFA",
          cursor: "pointer",
          transition: "all 0.15s",
          position: "relative",
        }}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ALL}
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
        />
        <p style={{ margin: "0 0 0.35rem", fontSize: compact ? "1.5rem" : "2.5rem" }}>📁</p>
        <p style={{ margin: "0 0 0.2rem", fontWeight: 700, color: "#0A1C2E", fontSize: compact ? "0.85rem" : "0.95rem" }}>
          Drag & drop files here, or click to browse
        </p>
        {!compact && (
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B", lineHeight: 1.6 }}>
            Documents · Images (OCR) · Audio/Video (Transcription) · Archives (Extraction)
            <br />
            PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, PNG, WEBP, MP3, WAV, MP4, ZIP, RAR and more
          </p>
        )}
      </div>

      {/* Quick action buttons */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => cameraRef.current?.click()} style={quickBtnStyle}>
          📷 Camera
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
        />
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          style={{
            ...quickBtnStyle,
            background: recording ? "#fee2e2" : "#F8FAFC",
            color: recording ? "#991b1b" : "#0A1C2E",
            border: recording ? "1.5px solid #fca5a5" : "1.5px solid #E2E8F0",
            animation: recording ? "pulse 1s infinite" : "none",
          }}
        >
          {recording ? "⏹ Stop Recording" : "🎙️ Voice Note"}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} style={quickBtnStyle}>
          📎 Browse Files
        </button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {files.map((f) => {
            const meta = getFileMeta(f.file);
            return (
              <div key={f.id} style={fileRowStyle}>
                <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0A1C2E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B" }}>{fmtBytes(f.size)}</span>
                    <span style={{ ...statusChipStyle, background: statusBg(f.status), color: statusColor(f.status) }}>
                      {f.status === "processing" && <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "0.25rem" }}>⟳</span>}
                      {f.status === "processing" ? PROC_MESSAGES[f.category] : f.status === "done" ? `✓ ${DONE_MESSAGES[f.category]}` : f.status === "error" ? "⚠ Error" : "Queued"}
                    </span>
                  </div>
                  {f.extractedText && (
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem", color: "#64748B", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {f.extractedText.slice(0, 120)}…
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => removeFile(f.id)} style={removeBtnStyle} title="Remove">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const quickBtnStyle: React.CSSProperties = {
  background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0A1C2E",
  padding: "0.4rem 0.85rem", borderRadius: "0.45rem", cursor: "pointer",
  fontWeight: 600, fontSize: "0.8rem", fontFamily: "inherit",
};
const fileRowStyle: React.CSSProperties = {
  display: "flex", gap: "0.75rem", alignItems: "flex-start",
  background: "#FFFFFF", border: "1.5px solid #E2E8F0",
  borderRadius: "0.65rem", padding: "0.75rem 1rem",
};
const statusChipStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center",
  padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700,
};
const removeBtnStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "#94A3B8", fontSize: "0.85rem", padding: "0.15rem",
  flexShrink: 0,
};
