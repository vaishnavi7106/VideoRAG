import WorthWatchingCard from '../WorthWatchingCard'
import ChapterCard from '../ChapterCard'
import SkeletonLoader from '../SkeletonLoader'

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Chapters
              </p>
              {video.key_sections.map((s, i) => (
                <ChapterCard key={i} section={s} videoId={video.video_id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}