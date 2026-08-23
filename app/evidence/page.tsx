'use client';
import { useState, useCallback, useRef } from 'react';

interface ExtractedData {
  parties: string[];
  dates: string[];
  facts: string[];
  contradictions: string[];
  keyDocuments: string[];
  caseStrength: number;
  summary: string;
  recommendedActions: string[];
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export default function EvidenceHub() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFilesLocally = useCallback(async (acceptedFiles: File[]): Promise<ExtractedData> => {
    const localResults: Array<{ name: string; size: number; type: string; hash: string; evidenceId: string; timestamp: string; status: string }> = [];
    for (const file of acceptedFiles) {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      localResults.push({
        name: file.name,
        size: file.size,
        type: file.type,
        hash,
        evidenceId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        status: 'ready',
      });
    }

    localStorage.setItem('ujris_evidence', JSON.stringify(localResults));

    return {
      parties: ['Claimant (You)', 'Respondent (To be identified in full analysis)'],
      dates: [`${localResults.length} file(s) prepared locally at ${new Date().toLocaleString()}`],
      facts: localResults.map((f) => `${f.name} hashed (SHA-256) and preserved locally for chain of custody`),
      contradictions: [],
      keyDocuments: localResults.map((f) => `${f.name} — ${f.hash.slice(0, 12)}...`),
      caseStrength: 40,
      summary: `${localResults.length} file(s) were processed locally because the server upload endpoint failed. Evidence hashes were stored in localStorage under "ujris_evidence".`,
      recommendedActions: [
        'Retry upload when server connectivity is restored',
        'Keep original files unchanged to preserve evidentiary integrity',
        'Use saved hashes to verify chain of custody',
      ],
    };
  }, []);

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setProcessing(true);
    setError('');
    setExtractedData(null);

    const newFiles: UploadedFile[] = acceptedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'processing',
    }));
    setFiles(newFiles);

    const formData = new FormData();
    acceptedFiles.forEach(f => formData.append('files', f));

    try {
      const res = await fetch('/api/evidence/process', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Upload API error (${res.status})`);
      const data = await res.json();
      setExtractedData(data);
      setFiles(prev => prev.map(f => ({ ...f, status: 'done' })));
    } catch (err) {
      console.warn('Evidence API failed, using local fallback', err);
      const fallback = await processFilesLocally(acceptedFiles);
      setExtractedData(fallback);
      setFiles(prev => prev.map(f => ({ ...f, status: 'done' })));
      setError('Server upload failed. Files were processed locally and are ready for analysis.');
    } finally {
      setProcessing(false);
    }
  }, [processFilesLocally]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    processFiles(dropped);
  }, [processFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const strengthColor = (score: number) =>
    score >= 75 ? '#10B981' : score >= 50 ? '#D97706' : '#E63946';

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Evidence Hub</h1>
        <p style={subtitleStyle}>Upload any evidence — AI extracts facts, parties, contradictions & case strength</p>
      </div>

      {/* Drop Zone */}
      <div
        style={{ ...dropZoneStyle, borderColor: dragging ? '#1B4D3E' : '#D1D5DB', background: dragging ? 'rgba(27,77,62,0.04)' : '#FAFAFA' }}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.mp3,.mp4,.txt,.odt"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📁</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
          {dragging ? 'Drop files here' : 'Drag & drop your evidence here'}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          PDF, DOCX, JPG, PNG, MP3, MP4, TXT — Max 50MB per file
        </p>
        <button style={uploadBtnStyle} type="button">Browse Files</button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div style={fileListStyle}>
          {files.map((f, i) => (
            <div key={i} style={fileItemStyle}>
              <span style={{ fontSize: '1.2rem' }}>
                {f.type.startsWith('image/') ? '🖼️' : f.type === 'application/pdf' ? '📄' : f.type.startsWith('audio/') ? '🎵' : f.type.startsWith('video/') ? '🎬' : '📝'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{f.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px',
                background: f.status === 'done' ? '#d1fae5' : f.status === 'error' ? '#fee2e2' : '#fef3c7',
                color: f.status === 'done' ? '#065f46' : f.status === 'error' ? '#991b1b' : '#92400e',
              }}>
                {f.status === 'processing' ? 'Analysing...' : f.status === 'done' ? 'Done' : f.status === 'error' ? 'Error' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {processing && (
        <div style={processingStyle}>
          <div style={spinnerStyle} />
          <span>AI is extracting intelligence from your evidence...</span>
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      {/* Results */}
      {extractedData && (
        <div style={resultsStyle}>
          <h2 style={resultsTitleStyle}>AI-Extracted Intelligence</h2>

          {/* Case Strength Meter */}
          <div style={strengthCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700 }}>Case Strength Score</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: strengthColor(extractedData.caseStrength) }}>
                {extractedData.caseStrength}/100
              </span>
            </div>
            <div style={{ height: '10px', background: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${extractedData.caseStrength}%`, background: strengthColor(extractedData.caseStrength), borderRadius: '999px', transition: 'width 1s ease' }} />
            </div>
          </div>

          <div style={twoColGrid}>
            <Section title="Parties Identified" items={extractedData.parties} icon="👥" />
            <Section title="Key Dates" items={extractedData.dates} icon="📅" />
            <Section title="Extracted Facts" items={extractedData.facts} icon="📋" />
            <Section title="Contradictions Detected" items={extractedData.contradictions} icon="⚠️" highlight />
          </div>

          <Section title="Recommended Actions" items={extractedData.recommendedActions} icon="✅" />

          <div style={summaryStyle}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1B4D3E' }}>Case Summary</h3>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{extractedData.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, items, icon, highlight }: { title: string; items: string[]; icon: string; highlight?: boolean }) {
  if (!items?.length) return null;
  return (
    <div style={{ ...sectionStyle, background: highlight ? 'rgba(230,57,70,0.04)' : '#F8FAFC', border: `1px solid ${highlight ? 'rgba(230,57,70,0.2)' : '#E2E8F0'}` }}>
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: highlight ? '#991b1b' : '#1B4D3E' }}>
        {icon} {title}
      </h3>
      <ul style={{ margin: 0, padding: '0 0 0 1.25rem' }}>
        {items.map((item, i) => <li key={i} style={{ fontSize: '0.88rem', marginBottom: '0.3rem', lineHeight: 1.5 }}>{item}</li>)}
      </ul>
    </div>
  );
}

const pageStyle: React.CSSProperties = { maxWidth: '900px', margin: '0 auto', padding: '2rem 1.25rem 5rem', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#0A1C2E' };
const headerStyle: React.CSSProperties = { marginBottom: '2rem' };
const titleStyle: React.CSSProperties = { margin: '0 0 0.35rem', fontSize: '2rem', fontWeight: 800 };
const subtitleStyle: React.CSSProperties = { margin: 0, color: '#4A5568', fontSize: '1rem' };
const dropZoneStyle: React.CSSProperties = { border: '2px dashed', borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem' };
const uploadBtnStyle: React.CSSProperties = { marginTop: '1.25rem', padding: '0.6rem 1.5rem', background: '#1B4D3E', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' };
const fileListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' };
const fileItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem' };
const processingStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(27,77,62,0.06)', borderRadius: '0.75rem', marginBottom: '1.5rem', color: '#1B4D3E', fontWeight: 600 };
const spinnerStyle: React.CSSProperties = { width: '20px', height: '20px', border: '3px solid #1B4D3E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' };
const errorStyle: React.CSSProperties = { padding: '0.75rem 1rem', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.25)', borderRadius: '0.5rem', color: '#991b1b', marginBottom: '1.5rem' };
const resultsStyle: React.CSSProperties = { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.5rem' };
const resultsTitleStyle: React.CSSProperties = { margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 800 };
const strengthCardStyle: React.CSSProperties = { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem' };
const twoColGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' };
const sectionStyle: React.CSSProperties = { borderRadius: '0.75rem', padding: '1rem' };
const summaryStyle: React.CSSProperties = { background: 'rgba(27,77,62,0.04)', border: '1px solid rgba(27,77,62,0.15)', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '1rem' };
