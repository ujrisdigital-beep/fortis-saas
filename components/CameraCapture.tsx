'use client'
import { useRef, useState, useCallback } from 'react'

const GOLD = '#C4943A'
const DARK = '#0F3D21'

interface CameraCaptureProps {
  onCapture: (dataUrl: string, file: File) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [step, setStep] = useState<'idle' | 'live' | 'preview'>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStep('live')
    } catch {
      setError('Camera access denied. Please allow camera permissions and try again.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setPreview(dataUrl)
    stopCamera()
    setStep('preview')
  }, [stopCamera])

  const retake = useCallback(() => {
    setPreview(null)
    setStep('idle')
    startCamera()
  }, [startCamera])

  const confirm = useCallback(() => {
    if (!preview) return
    // Convert dataUrl to File
    const arr = preview.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    const u8 = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i)
    const file = new File([u8], `document-capture-${Date.now()}.jpg`, { type: mime })
    stopCamera()
    onCapture(preview, file)
  }, [preview, stopCamera, onCapture])

  const handleClose = useCallback(() => {
    stopCamera()
    onClose()
  }, [stopCamera, onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{
        background: '#0F1A0F', border: '1px solid rgba(196,148,58,0.3)',
        borderRadius: 16, padding: '1.5rem', width: 520, maxWidth: '95vw',
        maxHeight: '95vh', overflow: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ color: GOLD, margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>📷 Capture Document</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#FF6B6B', fontSize: 13, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {step === 'idle' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>📄</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: '1.5rem' }}>
              Place your document flat and well-lit. The camera will capture it clearly.
            </p>
            <button
              onClick={startCamera}
              style={{ padding: '10px 28px', borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Start Camera
            </button>
          </div>
        )}

        {step === 'live' && (
          <div>
            <video
              ref={videoRef}
              style={{ width: '100%', borderRadius: 10, display: 'block', background: '#000' }}
              muted
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: '1rem', justifyContent: 'center' }}>
              <button
                onClick={capture}
                style={{ padding: '10px 32px', borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
              >
                📸 Capture
              </button>
              <button
                onClick={handleClose}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && preview && (
          <div>
            <img src={preview} alt="Captured document" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: '1rem', justifyContent: 'center' }}>
              <button
                onClick={confirm}
                style={{ padding: '10px 28px', borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                ✓ Use This Photo
              </button>
              <button
                onClick={retake}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
