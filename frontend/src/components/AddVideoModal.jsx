import { useState, useEffect, useRef } from 'react'
import { isValidYouTubeUrl } from '../utils/helpers'
import { summarizeVideo } from '../services/api'

const STEPS = ['Fetching transcript', 'Chunking & embedding', 'Generating summary', 'Worth watching analysis']

export default function AddVideoModal({ onClose, onAdd, existingUrls = [] }) {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState('concise')
  const [err, setErr] = useState('')
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState(-1)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleAdd() {
    const trimmed = url.trim()
    if (!trimmed) return
    if (!isValidYouTubeUrl(trimmed)) { setErr('Paste a valid YouTube URL'); return }
    if (existingUrls.includes(trimmed)) { setErr('This video is already added'); return }

    setErr('')
    setProcessing(true)
    setStep(0)

    const stepTimer = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s))
    }, 1800)

    try {
      const data = await summarizeVideo(trimmed, mode)
      clearInterval(stepTimer)
      setStep(STEPS.length)
      onAdd({ ...data, _url: trimmed, status: 'ready' })
      setTimeout(onClose, 400)
    } catch (e) {
      clearInterval(stepTimer)
      setErr(e.message || 'Failed to process video')
      setProcessing(false)
      setStep(-1)
    }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}
    >
      <div className="fade-up glow-violet" style={{
        width: '100%', maxWidth: 460,
        background: 'var(--ink-2)',
        border: '1px solid var(--border-md)',
        borderRadius: 'var(--radius-xl)',
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
            Add a video
          </span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, border: 'none',
            background: 'var(--ink-4)', color: 'var(--text-2)',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>

        {!processing ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  height: 42, padding: '0 14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${err ? 'var(--red)' : 'var(--border-md)'}`,
                  background: 'var(--ink-3)',
                  color: 'var(--text)', fontSize: 14,
                  fontFamily: 'var(--font-sans)', outline: 'none',
                  transition: 'border var(--transition)'
                }}
                onFocus={e => { if (!err) e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px var(--violet-dim)' }}
                onBlur={e => { e.target.style.borderColor = err ? 'var(--red)' : 'var(--border-md)'; e.target.style.boxShadow = 'none' }}
              />
              {err && <span style={{ fontSize: 12, color: 'var(--red)' }}>{err}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Summary depth</span>
              <div style={{
                display: 'flex', border: '1px solid var(--border-md)',
                borderRadius: 'var(--radius-sm)', overflow: 'hidden'
              }}>
                {['concise', 'detailed'].map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    padding: '4px 12px', fontSize: 12,
                    fontFamily: 'var(--font-sans)', border: 'none',
                    background: mode === m ? 'var(--violet)' : 'transparent',
                    color: mode === m ? '#fff' : 'var(--text-3)',
                    cursor: 'pointer', transition: 'all var(--transition)'
                  }}>{m}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{
                height: 38, padding: '0 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-md)',
                background: 'transparent',
                color: 'var(--text-2)', fontSize: 13,
                cursor: 'pointer', fontFamily: 'var(--font-sans)'
              }}>Cancel</button>
              <button onClick={handleAdd} disabled={!url.trim()} style={{
                height: 38, padding: '0 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: url.trim() ? 'var(--violet)' : 'var(--ink-4)',
                color: url.trim() ? '#fff' : 'var(--text-3)',
                fontSize: 13, fontWeight: 500,
                cursor: url.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition)'
              }}>Add & Process →</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
            {STEPS.map((s, i) => {
              const done = i < step
              const active = i === step
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `1.5px solid ${done ? 'var(--green)' : active ? 'var(--violet)' : 'var(--border-md)'}`,
                    background: done ? 'var(--green-dim)' : active ? 'var(--violet-dim)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: done ? 'var(--green)' : active ? 'var(--violet)' : 'var(--text-3)',
                    flexShrink: 0, transition: 'all 0.3s ease'
                  }}>
                    {done ? '✓' : active ? '⟳' : '○'}
                  </div>
                  <span style={{
                    fontSize: 13,
                    color: done ? 'var(--text-2)' : active ? 'var(--text)' : 'var(--text-3)',
                    transition: 'color 0.3s ease'
                  }}>{s}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}