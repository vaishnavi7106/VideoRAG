import { formatTime, openTimestamp } from '../utils/helpers'

export default function ChapterCard({ section, videoId }) {
  return (
    <button
      onClick={() => openTimestamp(videoId, section.start_time)}
      style={{
        width: '100%', textAlign: 'left',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--ink-3)',
        cursor: 'pointer', fontFamily: 'var(--font-sans)',
        transition: 'all var(--transition)',
        display: 'flex', gap: 10
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--ink-4)'
        e.currentTarget.style.borderColor = 'var(--violet-border)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--ink-3)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <span style={{
        fontSize: 11, fontFamily: 'var(--font-mono)',
        color: 'var(--teal)', flexShrink: 0, marginTop: 1,
        minWidth: 36
      }}>
        {formatTime(section.start_time)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2, lineHeight: 1.4 }}>
          {section.title}
        </div>
        {section.section_summary && (
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
            {section.section_summary}
          </p>
        )}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>↗</span>
    </button>
  )
}