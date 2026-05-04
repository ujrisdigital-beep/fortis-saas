'use client'
import { useState, useCallback, useRef } from 'react'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  status: 'uploading' | 'processing' | 'ready' | 'error'
  previewUrl?: string
  extractedText?: string
}

export default function UJRISGambiaPage() {
  const [caseDescription, setCaseDescription] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTool, setActiveTool] = useState('analyze')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [chatMessages, setChatMessages] = useState<{q: string; a: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [presentationGenerating, setPresentationGenerating] = useState(false)
  const [presentationResult, setPresentationResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async () => {
    if (!caseDescription.trim()) {
      alert('Please describe your legal issue')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/ujris/gambia-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: caseDescription })
      })

      const data = await response.json()
      setAnalysis(data)
    } catch {
      setAnalysis({ error: 'Analysis failed. Please try again.', analysis: { strengthScore: 0, warnings: [] } })
    }

    setLoading(false)
  }

  const processFile = async (file: File): Promise<UploadedFile> => {
    const uploadedFile: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading'
    }

    setUploadedFiles(prev => [...prev, uploadedFile])

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('caseDescription', caseDescription)

      const res = await fetch('/api/ujris/process-evidence', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()

      setUploadedFiles(prev => prev.map(f =>
        f.id === uploadedFile.id
          ? { ...f, status: result.success ? 'ready' : 'error', extractedText: result.transcript || result.extractedText }
          : f
      ))

      return { ...uploadedFile, status: result.success ? 'ready' : 'error', extractedText: result.transcript || result.extractedText }
    } catch {
      setUploadedFiles(prev => prev.map(f =>
        f.id === uploadedFile.id ? { ...f, status: 'error' } : f
      ))
      return { ...uploadedFile, status: 'error' }
    }
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return
    const validTypes = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png', 'audio/mpeg', 'audio/mp3', 'video/mp4']

    for (const file of Array.from(files)) {
      if (!validTypes.some(t => file.type.includes(t.split('/')[1]) || file.type.startsWith(t.split('/')[0]))) {
        alert(`Unsupported file type: ${file.name}`)
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large (max 10MB): ${file.name}`)
        continue
      }
      await processFile(file)
    }
  }, [caseDescription])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleAsk = async () => {
    if (!chatInput.trim()) return
    const q = chatInput
    setChatInput('')
    setChatLoading(true)
    setChatMessages(prev => [...prev, { q, a: '' }])

    try {
      const res = await fetch('/api/ujris/gambia-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${caseDescription}\n\nQuestion: ${q}`, isQuestion: true })
      })
      const data = await res.json()
      setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, a: data.analysis?.summary || JSON.stringify(data) } : m))
    } catch {
      setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, a: 'Sorry, I could not answer that question. Try rephrasing.' } : m))
    }

    setChatLoading(false)
  }

  const generatePresentation = async () => {
    if (uploadedFiles.length === 0 && !caseDescription.trim()) {
      alert('Please enter a case description or upload evidence first')
      return
    }
    setPresentationGenerating(true)
    setPresentationResult(null)

    try {
      const res = await fetch('/api/ujris/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseDescription,
          files: uploadedFiles.filter(f => f.status === 'ready').map(f => ({ name: f.name, extractedText: f.extractedText }))
        })
      })
      const data = await res.json()
      setPresentationResult(data)
    } catch {
      setPresentationResult({ error: 'Generation failed. Please try again.' })
    }

    setPresentationGenerating(false)
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-5xl mb-3">⚖️</div>
          <h1 className="text-3xl md:text-4xl font-bold">UJRIS Gambia</h1>
          <p className="text-amber-100 mt-2">Justice Intelligence for The Gambia</p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <span className="px-2 py-1 bg-amber-800 rounded-full text-xs">Labour Act 2007</span>
            <span className="px-2 py-1 bg-amber-800 rounded-full text-xs">Evidence Act 2019</span>
            <span className="px-2 py-1 bg-amber-800 rounded-full text-xs">Industrial Court</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-around text-center">
          <div className="flex-1"><span className="text-amber-600 font-bold">1</span><p className="text-sm">Open UJRIS</p></div>
          <div className="flex-1"><span className="text-amber-600 font-bold">2</span><p className="text-sm">Choose Tool</p></div>
          <div className="flex-1"><span className="text-amber-600 font-bold">3</span><p className="text-sm">Generate Report</p></div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto border-b">
          {[
            { key: 'analyze', label: '📊 Case Analysis' },
            { key: 'deadlines', label: '⏰ Deadlines' },
            { key: 'documents', label: '📄 Documents' },
            { key: 'evidence', label: '🔍 Evidence Hub' },
            { key: 'presentation', label: '🎬 AI Presentation' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTool(key)}
              className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                activeTool === key
                  ? 'border-b-2 border-amber-600 text-amber-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Case Analysis */}
        {activeTool === 'analyze' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-3">Describe Your Legal Issue</h2>
              <textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Example: I was dismissed from my job at [company] on [date]. I believe it was unfair because..."
                className="w-full h-36 p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-4 w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing under Gambian Law...' : 'Analyze My Case →'}
              </button>
            </div>

            {analysis && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">Analysis Results</h3>
                {analysis.error ? (
                  <p className="text-red-600">{analysis.error}</p>
                ) : analysis.analysis ? (
                  <div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Strength Score: </span>
                      <span className={`font-bold text-xl ${
                        (analysis.analysis.strengthScore || 0) >= 80 ? 'text-green-600' :
                        (analysis.analysis.strengthScore || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {analysis.analysis.strengthScore || 0}/100
                      </span>
                    </div>
                    {analysis.analysis.categorySummary?.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-sm mb-2">Detected Patterns:</p>
                        {analysis.analysis.categorySummary.map((cat: any, i: number) => (
                          <span key={i} className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs mr-2 mb-2">
                            {cat.category}: {cat.count}
                          </span>
                        ))}
                      </div>
                    )}
                    {analysis.analysis.alerts?.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Alerts:</p>
                        <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
                          {analysis.analysis.alerts.map((a: any, i: number) => (
                            <li key={i}>
                              <strong>{a.ruleId}:</strong> {a.explanation} — <em>{a.counterAction}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.analysis.recommendation && (
                      <p className="mt-4 p-3 bg-amber-50 rounded-lg text-sm font-medium">
                        💡 {analysis.analysis.recommendation}
                      </p>
                    )}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-xs overflow-x-auto">{JSON.stringify(analysis, null, 2)}</pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deadlines */}
        {activeTool === 'deadlines' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-3">⏰ Gambian Legal Deadlines</h2>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="font-bold text-red-700">Industrial Court Claim</p>
                <p>File within <strong>30 days</strong> (statutory) or <strong>90 days</strong> (discretionary)</p>
                <p className="text-sm text-gray-600">File early - Court has discretion but dont rely on it</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-bold text-blue-700">Access to Information Request</p>
                <p>Response required within <strong>30 days</strong> (Data Protection Act 2024)</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-bold text-purple-700">High Court Appeal</p>
                <p>File within <strong>14 days</strong> of judgment</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-700">Labour Mediation</p>
                <p>Attempt within <strong>14 days</strong> before Industrial Court</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTool === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-3">📄 Legal Document Templates</h2>
            <div className="space-y-4">
              <a href="/ujris/gambia/draft?template=ic1" className="block p-4 bg-amber-50 rounded-lg hover:bg-amber-100">
                <p className="font-bold">Industrial Court Complaint (IC-1)</p>
                <p className="text-sm text-gray-600">Fee: D100 | For: Unfair dismissal, discrimination</p>
              </a>
              <a href="/ujris/gambia/draft?template=grievance" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <p className="font-bold">Grievance Letter</p>
                <p className="text-sm text-gray-600">Free | Before escalating to Court</p>
              </a>
              <a href="/ujris/gambia/draft?template=sar" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <p className="font-bold">Subject Access Request</p>
                <p className="text-sm text-gray-600">Free | Data Protection Act 2024</p>
              </a>
            </div>
          </div>
        )}

        {/* Evidence Hub - File Upload */}
        {activeTool === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-3">🔍 Evidence Upload</h2>
              <p className="text-sm text-gray-500 mb-4">Upload contracts, dismissal letters, payslips, emails, WhatsApp screenshots, or audio recordings.</p>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-500'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp3,.wav,.mp4"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <div className="text-4xl mb-3">📁</div>
                <p className="font-medium">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">PDF, DOCX, TXT, JPG, PNG, MP3, MP4 — Max 10MB per file</p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">📎 Uploaded Files ({uploadedFiles.length})</h3>
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {file.type.includes('image') ? '🖼️' :
                           file.type.includes('audio') ? '🎤' :
                           file.type.includes('video') ? '🎥' : '📄'}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(file.size)} &nbsp;
                            {file.status === 'uploading' && '⏳ Uploading...'}
                            {file.status === 'processing' && '🤖 AI Processing...'}
                            {file.status === 'ready' && '✅ Ready — extracted text loaded'}
                            {file.status === 'error' && '❌ Error — try uploading again'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
              <h4 className="font-bold mb-3">🔍 Evidence Guidelines</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Document Authentication:</strong> Get documents notarised by a Notary Public</li>
                <li><strong>Witness Statements:</strong> Prepare in advance — attend court for cross-examination</li>
                <li><strong>Digital Evidence:</strong> Preserve originals — show chain of custody</li>
                <li><strong>SMS/WhatsApp:</strong> Screenshots must show the full phone number and contact name</li>
              </ul>
            </div>
          </div>
        )}

        {/* AI Presentation */}
        {activeTool === 'presentation' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-2xl font-bold mb-2">AI Case Presentation</h3>
              <p className="text-amber-100 mb-6">Generate a complete presentation from your evidence — slide deck, executive summary, and court-ready report.</p>
              <button
                onClick={generatePresentation}
                disabled={presentationGenerating}
                className="px-8 py-3 bg-white text-amber-700 rounded-xl font-bold hover:bg-amber-50 disabled:opacity-50"
              >
                {presentationGenerating ? 'Generating with GPT-4...' : 'Generate AI Presentation →'}
              </button>
            </div>

            {presentationResult && (
              <div>
                {presentationResult.error ? (
                  <div className="bg-red-50 rounded-xl p-4 text-red-700">{presentationResult.error}</div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {presentationResult.slides?.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                        <div className="text-4xl mb-3">📊</div>
                        <h4 className="font-bold mb-2">Slide Deck</h4>
                        <p className="text-xs text-gray-600 mb-3">{presentationResult.slides.length} slides generated</p>
                        <div className="space-y-2">
                          {presentationResult.slides.slice(0, 5).map((s: any, i: number) => (
                            <p key={i} className="text-sm text-gray-700 truncate">{i+1}. {s.title || s.slideTitle || 'Slide ' + (i+1)}</p>
                          ))}
                          {presentationResult.slides.length > 5 && (
                            <p className="text-xs text-gray-400">+ {presentationResult.slides.length - 5} more...</p>
                          )}
                        </div>
                      </div>
                    )}

                    {presentationResult.audioScript && (
                      <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                        <div className="text-4xl mb-3">🎧</div>
                        <h4 className="font-bold mb-2">Audio Summary</h4>
                        <p className="text-xs text-gray-600 mb-3">5-minute case overview script</p>
                        <p className="text-sm text-gray-700 italic">"{presentationResult.audioScript.slice(0, 120)}..."</p>
                      </div>
                    )}

                    {presentationResult.keyArguments?.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                        <div className="text-4xl mb-3">⚖️</div>
                        <h4 className="font-bold mb-2">Key Arguments</h4>
                        <p className="text-xs text-gray-600 mb-3">{presentationResult.keyArguments.length} arguments identified</p>
                        <div className="space-y-2 text-left">
                          {presentationResult.keyArguments.slice(0, 3).map((a: any, i: number) => (
                            <p key={i} className="text-sm">
                              <strong>Argument {i+1}:</strong> {a.claim?.slice(0, 80) || 'See analysis'} — Strength: {a.strength || 'N/A'}/10
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  {uploadedFiles.filter(f => f.status === 'ready').length} of {uploadedFiles.length} files processed — ready for presentation
                </p>
              </div>
            )}

            {/* Interactive Q&A */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">💬 Ask about your case</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-gray-700">Q: {m.q}</p>
                    <p className="text-sm text-gray-600 mt-1 mb-3">A: {m.a}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="e.g. What are the strongest arguments in my case?"
                  className="flex-1 p-3 border rounded-lg"
                />
                <button
                  onClick={handleAsk}
                  disabled={chatLoading}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50"
                >
                  {chatLoading ? '...' : 'Ask'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>UJRIS provides legal information, not legal advice. Consult a qualified Gambian lawyer.</p>
          <p className="mt-1">Powered by UJU Cycle™ — Gambia's most comprehensive legal intelligence system</p>
        </div>
      </div>
    </div>
  )
}