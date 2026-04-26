import { useState } from 'react'

export default function HistoryPanel({ history, onSelect, onClear }) {
  const [open, setOpen] = useState(false)

  if (!history.length) return null

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: open ? 8 : 0 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 0,
            fontFamily: 'var(--font-sans)'
          }}
        >
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.15s',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
          }}>▶</span>
          Recent questions
        </button>
        {open && (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--text-3)',
              padding: 0,
              fontFamily: 'var(--font-sans)'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {history.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(q)}
              style={{
                textAlign: 'left',
                padding: '7px 10px',
                borderRadius: 'var(--radius-md)',
                border: '0.5px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-2)',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'background var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}