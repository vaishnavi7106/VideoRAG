import ChapterCard from './ChapterCard'
import SkeletonLoader from './SkeletonLoader'

export default function SummaryPanel({ video }) {
  const isLoading = video.status === 'loading'

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* header */}
      <div style={{
        padding: '11px 14px',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 9
      }}>
        {video.thumbnail && (
          <img src={video.thumbnail} alt=""
            style={{ width: 34, height: 22, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {video.video_title || 'Loading…'}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '13px 14px' }}>
        {isLoading ? (
          <>
            <SkeletonLoader lines={3} style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[1,2,3].map(i => <SkeletonLoader key={i} lines={2} />)}
            </div>
          </>
        ) : (
          <>
            {video.summary && (
              <p style={{
                fontSize: 12, color: 'var(--text-2)',
                lineHeight: 1.65, marginBottom: 12
              }}>
                {video.summary}
              </p>
            )}
            {video.key_sections?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {video.key_sections.map((s, i) => (
                  <ChapterCard key={i} section={s} videoId={video.video_id} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}