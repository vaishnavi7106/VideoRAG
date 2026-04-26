export default function WorthWatchingCard({ data }) {
  if (!data) return null
  const { verdict, target_audience, covers = [], skips = [], watch_if } = data

  return (
    <div style={{
      background: 'var(--violet-dim)',
      border: '1px solid var(--violet-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px',
      marginBottom: 16,
      boxShadow: '0 0 24px var(--violet-glow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>✦</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--violet-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Worth watching?
        </span>
      </div>

      {verdict && (
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>
          {verdict}
        </p>
      )}

      {target_audience && (
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
          <span style={{ color: 'var(--text-3)' }}>Best for: </span>{target_audience}
        </p>
      )}

      {covers.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Covers</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {covers.map((c, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '2px 8px',
                borderRadius: 99,
                background: 'var(--green-dim)',
                border: '1px solid var(--green-border)',
                color: 'var(--green)'
              }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {skips.length > 0 && (
        <div style={{ marginBottom: watch_if ? 10 : 0 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Skips</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {skips.map((s, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '2px 8px',
                borderRadius: 99,
                background: 'var(--red-dim)',
                border: '1px solid rgba(224,92,92,0.25)',
                color: 'var(--red)'
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {watch_if && (
        <p style={{ fontSize: 12, color: 'var(--violet-2)', marginTop: 10, fontStyle: 'italic' }}>
          {watch_if}
        </p>
      )}
    </div>
  )
}