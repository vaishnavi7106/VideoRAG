import { formatTime, openTimestamp } from '../utils/helpers'

export default function SourceChip({ source }) {
  return (
    <button
      onClick={() => openTimestamp(source.video_id, source.start_time)}
      title={source.video_label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 9px 4px 5px',
        borderRadius: 99,
        border: '1px solid var(--border-md)',
        background: 'var(--ink-3)',
        cursor: 'pointer', fontFamily: 'var(--font-sans)',
        transition: 'all var(--transition)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--teal-border)'
        e.currentTarget.style.background = 'var(--teal-dim)'
        e.currentTarget.style.boxShadow = '0 0 10px var(--teal-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-md)'
        e.currentTarget.style.background = 'var(--ink-3)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {source.thumbnail && (
        <img src={source.thumbnail} alt="" style={{
          width: 22, height: 15, objectFit: 'cover',
          borderRadius: 3, flexShrink: 0
        }} />
      )}
      <span style={{ fontSize: 11, color: 'var(--text-2)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {source.video_label?.split(' ').slice(0, 3).join(' ')}
      </span>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--teal)', flexShrink: 0 }}>
        {formatTime(source.start_time)} ↗
      </span>
    </button>
  )
}