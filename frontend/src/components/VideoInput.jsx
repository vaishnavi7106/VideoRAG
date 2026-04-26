import { useState } from 'react'
import { isValidYouTubeUrl } from '../utils/helpers'

export default function VideoInput({ onAdd, loading, maxReached }) {
  const [url, setUrl] = useState('')
  const [err, setErr] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    if (!isValidYouTubeUrl(trimmed)) {
      setErr('Paste a valid YouTube URL')
      return
    }
    setErr('')
    onAdd(trimmed)
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); setErr('') }}
          placeholder="Paste YouTube URL…"
          disabled={loading || maxReached}
          style={{
            flex: 1,
            height: 40,
            padding: '0 14px',
            borderRadius: 'var(--radius-md)',
            border: `0.5px solid ${err ? 'var(--danger)' : 'var(--border-md)'}`,
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border var(--transition)'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'}
          onBlur={e => e.target.style.borderColor = err ? 'var(--danger)' : 'var(--border-md)'}
        />
        <button
          type="submit"
          disabled={loading || maxReached || !url.trim()}
          style={{
            height: 40,
            padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--purple)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: loading || maxReached ? 'not-allowed' : 'pointer',
            opacity: loading || maxReached ? 0.5 : 1,
            transition: 'opacity var(--transition)',
            fontFamily: 'var(--font-sans)',
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? 'Adding…' : 'Add Video'}
        </button>
      </div>
      {err && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{err}</span>}
      {maxReached && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Maximum 3 videos for comparison.</span>}
    </form>
  )
}