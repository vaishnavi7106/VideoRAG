import { useState } from 'react'
import { formatTime, openTimestamp } from '../../utils/helpers'
import { explainSearchResult } from '../../services/api'

function SearchResultCard({ hit, query, video }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function handleExpand() {
    if (expanded) { setExpanded(false); return }
    setExpanded(true)
    if (explanation) return
    setLoading(true)
    try {
      const data = await explainSearchResult(
        query,
        hit.text,
        hit.start_time,
        hit.end_time
      )
      setExplanation(data.explanation)
    } catch {
      setExplanation(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      background: 'var(--ink-3)',
      overflow: 'hidden',
      transition: 'all var(--transition)'
    }}>
      {/* main row */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 13px', cursor: 'pointer'
        }}
        onClick={() => openTimestamp(video.video_id, hit.start_time)}
        onMouseEnter={e => { e.currentTarget.parentElement.style.borderColor = 'var(--teal-border)'; e.currentTarget.parentElement.style.boxShadow = '0 0 10px var(--teal-glow)' }}
        onMouseLeave={e => { e.currentTarget.parentElement.style.borderColor = 'var(--border)'; e.currentTarget.parentElement.style.boxShadow = 'none' }}
      >
        <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>
          {formatTime(hit.start_time)} → {formatTime(hit.end_time)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* explain toggle */}
          <button
            onClick={e => { e.stopPropagation(); handleExpand() }}
            style={{
              fontSize: 11, padding: '2px 8px',
              borderRadius: 99,
              border: `1px solid ${expanded ? 'var(--violet-border)' : 'var(--border-md)'}`,
              background: expanded ? 'var(--violet-dim)' : 'transparent',
              color: expanded ? 'var(--violet-2)' : 'var(--text-3)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition)'
            }}
          >
            {loading ? '…' : expanded ? 'Hide' : 'Explain'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Jump ↗</span>
        </div>
      </div>

      {/* explanation panel */}
      {expanded && (
        <div style={{
          padding: '10px 13px',
          borderTop: '1px solid var(--border)',
          background: 'var(--ink-2)'
        }}>
          {loading ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[1,2,3].map(n => (
                <span key={n} className="tdot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', display: 'inline-block' }} />
              ))}
            </div>
          ) : explanation ? (
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>
              {explanation}
            </p>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>
              Could not generate explanation.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchTab({ video, search }) {
  const { query, setQuery, results, loading, error, searched, search: doSearch, clear } = search

  function handleSearch(e) {
    e.preventDefault()
    if (video?._url) doSearch(video._url, query)
  }

  return (
    <div style={{
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column',
      gap: 14, height: '100%', overflow: 'hidden'
    }}>
      {/* search input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
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
        <button
          type="submit"
          disabled={!query.trim() || loading || !video}
          style={{
            height: 40, padding: '0 18px',
            borderRadius: 'var(--radius-md)', border: 'none',
            background: query.trim() && video ? 'var(--teal)' : 'var(--ink-4)',
            color: query.trim() && video ? 'var(--ink)' : 'var(--text-3)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', flexShrink: 0,
            transition: 'all var(--transition)'
          }}
        >
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {/* result count */}
      {searched && !loading && results.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>
          {results.length} moments found · click timestamps to jump · click Explain for AI summary
        </p>
      )}

      {/* results */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
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
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 8 }}>Search by concept</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
              Try: "error handling", "when to use classes",<br />
              "what caused the symptoms", "key argument"
            </p>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        )}

        {!loading && results.map((hit, i) => (
          <SearchResultCard
            key={i}
            hit={hit}
            query={query}
            video={video}
          />
        ))}
      </div>
    </div>
  )
}