import { formatTime, openTimestamp } from '../../utils/helpers'
import SkeletonLoader from '../SkeletonLoader'

export default function SearchTab({ video, search }) {
  const { query, setQuery, results, loading, error, searched, search: doSearch, clear } = search

  function handleSearch(e) {
    e.preventDefault()
    if (video?._url) doSearch(video._url, query)
  }

  return (
    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden' }}>
      {/* search input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by concept, not keyword…"
          style={{
            flex: 1, height: 40, padding: '0 13px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-md)',
            background: 'var(--ink-3)', color: 'var(--text)',
            fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
            transition: 'all var(--transition)'
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px var(--teal-dim)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.boxShadow = 'none' }}
        />
        <button type="submit" disabled={!query.trim() || loading || !video} style={{
          height: 40, padding: '0 16px',
          borderRadius: 'var(--radius-md)', border: 'none',
          background: query.trim() && video ? 'var(--teal)' : 'var(--ink-4)',
          color: query.trim() && video ? 'var(--ink)' : 'var(--text-3)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', flexShrink: 0,
          transition: 'all var(--transition)'
        }}>Search</button>
      </form>

      {/* results */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--red-dim)', border: '1px solid rgba(224,92,92,0.2)', fontSize: 13, color: 'var(--red)' }}>
            {error}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)', fontSize: 13 }}>
            No relevant moments found for "{query}"
          </div>
        )}

        {!loading && !searched && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>Search by concept</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
              Try: "error handling", "when to use classes",<br/>"performance tips", "common mistakes"
            </p>
          </div>
        )}

        {results.map((hit, i) => (
          <button key={i} onClick={() => openTimestamp(video.video_id, hit.start_time)}
            className="fade-up"
            style={{
              textAlign: 'left', width: '100%',
              padding: '12px 13px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--ink-3)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-border)'; e.currentTarget.style.background = 'var(--ink-4)'; e.currentTarget.style.boxShadow = '0 0 12px var(--teal-glow)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--ink-3)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>
                {formatTime(hit.start_time)} → {formatTime(hit.end_time)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Jump ↗</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {hit.sentences?.[0] || hit.text}
            </p>
          </button>
        ))}

        {results.length > 0 && (
          <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '8px 0' }}>
            {results.length} moments found · sorted by relevance
          </p>
        )}
      </div>
    </div>
  )
}