import { useState } from 'react'
import SourceChip from './SourceChip'

export default function MessageBubble({ message }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  // ── user bubble ──
  if (message.role === 'user') {
    return (
      <div className="fade-up" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 2
      }}>
        <div style={{
          background: 'var(--violet-dim)',
          border: '1px solid var(--violet-border)',
          color: 'var(--text)',
          padding: '9px 13px',
          borderRadius: '14px 14px 3px 14px',
          fontSize: 14,
          maxWidth: '82%',
          lineHeight: 1.55,
          wordBreak: 'break-word'
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  // ── assistant message ──
  // Split content into first sentence (direct answer) + rest (detail)
  // so the most important part is always visually prominent
  const content = message.content || ''
  const firstSentenceEnd = content.search(/(?<=[.!?])\s+[A-Z]/)
  const hasStructure = firstSentenceEnd > 0 && firstSentenceEnd < content.length * 0.6

  const directAnswer = hasStructure ? content.slice(0, firstSentenceEnd + 1).trim() : content
  const supportingDetail = hasStructure ? content.slice(firstSentenceEnd + 1).trim() : null

  const hasSources = message.sources?.length > 0

  return (
    <div className="fade-up" style={{ marginBottom: 4 }}>

      {/* direct answer — visually prominent */}
      <p style={{
        fontSize: 14,
        color: 'var(--text)',
        lineHeight: 1.75,
        marginBottom: supportingDetail ? 8 : 10,
        wordBreak: 'break-word',
        fontWeight: hasStructure ? 500 : 400
      }}>
        {directAnswer}
      </p>

      {/* supporting detail — slightly dimmer */}
      {supportingDetail && (
        <p style={{
          fontSize: 13,
          color: 'var(--text-2)',
          lineHeight: 1.7,
          marginBottom: 10,
          wordBreak: 'break-word'
        }}>
          {supportingDetail}
        </p>
      )}

      {/* action row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flexWrap: 'wrap',
        marginBottom: hasSources && sourcesOpen ? 8 : 0
      }}>
        {/* copy */}
        <button
          onClick={copy}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, padding: '3px 9px',
            borderRadius: 99,
            border: '1px solid var(--border-md)',
            background: copied ? 'var(--green-dim)' : 'var(--ink-3)',
            color: copied ? 'var(--green)' : 'var(--text-3)',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            transition: 'all var(--transition)',
            whiteSpace: 'nowrap'
          }}
        >
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>

        {/* sources toggle — like Claude's collapsible sources */}
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
              transition: 'all var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{
              display: 'inline-block',
              transition: 'transform 0.15s',
              transform: sourcesOpen ? 'rotate(90deg)' : 'none',
              fontSize: 9
            }}>▶</span>
            {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
          </button>
        )}

        {/* compare mode badge */}
        {message.mode === 'multi_video_comparison' && (
          <span style={{
            fontSize: 10, padding: '2px 7px',
            borderRadius: 99,
            background: 'var(--violet-dim)',
            border: '1px solid var(--violet-border)',
            color: 'var(--violet-2)'
          }}>
            across {message.sources
              ? [...new Set(message.sources.map(s => s.video_id))].length
              : 0} videos
          </span>
        )}
      </div>

      {/* sources — collapsible panel */}
      {hasSources && sourcesOpen && (
        <div
          className="fade-up"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--ink-3)',
            border: '1px solid var(--border)'
          }}
        >
          {message.sources.map((src, i) => (
            <SourceChip key={i} source={src} />
          ))}
        </div>
      )}
    </div>
  )
}