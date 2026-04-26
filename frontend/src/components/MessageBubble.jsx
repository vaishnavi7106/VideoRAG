import { useState } from 'react'
import SourceChip from './SourceChip'

export default function MessageBubble({ message, index }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  if (message.role === 'user') {
    return (
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <div style={{
          background: 'var(--violet-dim)',
          border: '1px solid var(--violet-border)',
          color: 'var(--text)',
          padding: '9px 13px',
          borderRadius: '14px 14px 3px 14px',
          fontSize: 14, maxWidth: '82%', lineHeight: 1.55,
          wordBreak: 'break-word'
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  const hasSources = message.sources?.length > 0

  return (
    <div className="fade-up" style={{ marginBottom: 4 }}>
      <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, marginBottom: 10, wordBreak: 'break-word' }}>
        {message.content}
      </p>

      {/* action row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* copy button */}
        <button onClick={copy} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, padding: '3px 9px',
          borderRadius: 99,
          border: '1px solid var(--border-md)',
          background: copied ? 'var(--green-dim)' : 'var(--ink-3)',
          color: copied ? 'var(--green)' : 'var(--text-3)',
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          transition: 'all var(--transition)'
        }}>
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>

        {/* sources toggle — like Claude's "sources" button */}
        {hasSources && (
          <button
            onClick={() => setSourcesOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, padding: '3px 9px',
              borderRadius: 99,
              border: `1px solid ${sourcesOpen ? 'var(--teal-border)' : 'var(--border-md)'}`,
              background: sourcesOpen ? 'var(--teal-dim)' : 'var(--ink-3)',
              color: sourcesOpen ? 'var(--teal)' : 'var(--text-3)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition)'
            }}
          >
            <span style={{
              display: 'inline-block',
              transition: 'transform 0.15s',
              transform: sourcesOpen ? 'rotate(90deg)' : 'none'
            }}>▶</span>
            {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* sources panel — collapsible */}
      {hasSources && sourcesOpen && (
        <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
          {message.sources.map((src, i) => (
            <SourceChip key={i} source={src} />
          ))}
        </div>
      )}
    </div>
  )
}