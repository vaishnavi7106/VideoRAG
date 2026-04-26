import { useState } from 'react'
import WorthWatchingCard from '../WorthWatchingCard'
import ChapterCard from '../ChapterCard'
import SkeletonLoader from '../SkeletonLoader'
import { getTranscript } from '../../services/api'

function TranscriptDownloadButton({ video }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleDownload() {
    if (!video?._url) return
    setLoading(true)
    setError(null)
    try {
      const data = await getTranscript(video._url)
      // create and trigger download
      const blob = new Blob([data.transcript_text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${video.video_title?.slice(0, 40).replace(/[^a-z0-9]/gi, '_') || 'transcript'}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      setError('Download failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, padding: '5px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-md)',
          background: loading ? 'var(--ink-4)' : 'var(--ink-3)',
          color: loading ? 'var(--text-3)' : 'var(--text-2)',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'all var(--transition)'
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--border-lg)'; e.currentTarget.style.color = 'var(--text)' } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-2)' }}
      >
        {loading ? '⟳ Downloading…' : '↓ Download transcript'}
      </button>
      {error && <span style={{ fontSize: 11, color: 'var(--red)', marginLeft: 8 }}>{error}</span>}
    </div>
  )
}

export default function SummaryTab({ video }) {
  if (!video) return (
    <div style={{ padding: 20, color: 'var(--text-3)', fontSize: 13 }}>
      Select a video from the sidebar.
    </div>
  )

  const isLoading = video.status === 'loading'

  return (
    <div style={{ padding: '18px 20px', overflowY: 'auto', height: '100%' }}>
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />
          <SkeletonLoader lines={3} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="stagger">
          {video.worth_watching && <WorthWatchingCard data={video.worth_watching} />}

          {video.summary && (
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 18 }}>
              {video.summary}
            </p>
          )}

          {video.key_sections?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Chapters
              </p>
              {video.key_sections.map((s, i) => (
                <ChapterCard key={i} section={s} videoId={video.video_id} />
              ))}
            </div>
          )}

          {/* transcript download */}
          <div style={{
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            marginTop: 4
          }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
              Full transcript with timestamps
            </p>
            <TranscriptDownloadButton video={video} />
          </div>
        </div>
      )}
    </div>
  )
}