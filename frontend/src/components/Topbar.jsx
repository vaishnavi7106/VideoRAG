export default function Topbar({ dark, toggleDark, onAddVideo, showWorkspace }) {
  return (
    <div style={{
      height: 'var(--topbar-h)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      background: 'var(--ink-2)',
      position: 'sticky', top: 0, zIndex: 50,
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 26, height: 26, background: 'var(--violet)',
          borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px var(--violet-glow)'
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          VideoRAG
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            boxShadow: '0 0 12px var(--violet-glow)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--violet)' + ' !important'}
          >
            <span style={{ fontSize: 15 }}>+</span> Add Video
          </button>
        )}
        <button onClick={toggleDark} style={{
          width: 32, height: 32, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-md)',
          background: 'var(--ink-3)', color: 'var(--text-2)',
          cursor: 'pointer', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>☽</button>
      </div>
    </div>
  )
}