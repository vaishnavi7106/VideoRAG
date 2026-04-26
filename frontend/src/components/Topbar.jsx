export default function Topbar({ onAddVideo, onGoHome, showWorkspace }) {
  return (
    <div style={{
      height: 'var(--topbar-h)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--ink-2)',
      position: 'sticky', top: 0, zIndex: 50,
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* back to landing */}
        {onGoHome && (
          <button onClick={onGoHome}
            title="Back to home"
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: '1px solid var(--border-md)',
              background: 'transparent', color: 'var(--text-3)',
              cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all var(--transition)', marginRight: 2
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-lg)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-3)' }}
          >←</button>
        )}

        <div style={{
          width: 26, height: 26, background: 'var(--violet)',
          borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px var(--violet-glow)', flexShrink: 0
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          VideoRAG
        </span>
      </div>

      {showWorkspace && (
        <button onClick={onAddVideo} style={{
          height: 32, padding: '0 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--violet-border)',
          background: 'var(--violet-dim)',
          color: 'var(--violet-2)', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          display: 'flex', alignItems: 'center', gap: 5,
          transition: 'all var(--transition)',
          boxShadow: '0 0 10px var(--violet-glow)'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,127,248,0.22)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--violet-dim)' }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Add Video
        </button>
      )}
    </div>
  )
}