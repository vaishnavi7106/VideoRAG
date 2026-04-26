const STATUS = {
  loading: { color: 'var(--amber)', label: 'Processing…' },
  ready:   { color: 'var(--green)', label: 'Ready' },
  error:   { color: 'var(--danger)', label: 'Error' }
}

export default function VideoCard({ video, onRemove }) {
  const s = STATUS[video.status || 'ready']

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 11px',
      background: 'var(--bg-surface)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        width: 52, height: 34,
        borderRadius: 4,
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--bg-hover)'
      }}>
        {video.thumbnail
          ? <img src={video.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: 'var(--purple-light)' }} />
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {video.video_title || 'Loading…'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{s.label}</span>
          {video.num_chunks > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>· {video.num_chunks} chunks</span>
          )}
        </div>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: 'none',
            background: 'transparent', color: 'var(--text-3)',
            cursor: 'pointer', fontSize: 15, flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >×</button>
      )}
    </div>
  )
}