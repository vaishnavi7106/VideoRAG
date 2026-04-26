import { useState } from 'react'

function VideoItem({ video, active, onSelect, onRemove }) {
  return (
    <div
      onClick={() => onSelect(video.video_id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '7px 9px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${active ? 'var(--violet-border)' : 'transparent'}`,
        background: active ? 'var(--violet-dim)' : 'transparent',
        cursor: 'pointer', transition: 'all var(--transition)'
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--ink-3)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ width: 44, height: 30, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: 'var(--ink-4)' }}>
        {video.thumbnail
          ? <img src={video.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%' }} />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 12, fontWeight: 500,
          color: active ? 'var(--violet-2)' : 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3
        }}>
          {video.video_title || 'Loading…'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
            background: video.status === 'ready' ? 'var(--green)' : video.status === 'loading' ? 'var(--amber)' : 'var(--red)'
          }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
            {video.status === 'ready' ? `${video.num_chunks || '?'} chunks` : video.status === 'loading' ? 'Processing…' : 'Error'}
          </span>
        </div>
      </div>
      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove(video.video_id) }}
          style={{ width: 18, height: 18, borderRadius: 3, border: 'none', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >×</button>
      )}
    </div>
  )
}

function SessionItem({ session, active, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false)

  const timeAgo = (() => {
    const diff = Date.now() - session.updatedAt
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  })()

  const displayTitle = session.title ||
    (session.messages?.[0]?.content?.slice(0, 36) + (session.messages?.[0]?.content?.length > 36 ? '…' : '')) ||
    'New conversation'

  return (
    <div
      onClick={() => onSelect(session.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 9px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${active ? 'var(--violet-border)' : 'transparent'}`,
        background: active ? 'var(--violet-dim)' : hovered ? 'var(--ink-3)' : 'transparent',
        cursor: 'pointer', transition: 'all var(--transition)'
      }}
    >
      {/* title */}
      <p style={{
        fontSize: 12, color: active ? 'var(--violet-2)' : 'var(--text)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        lineHeight: 1.35, marginBottom: 5
      }}>
        {displayTitle}
      </p>

      {/* video thumbnails row */}
      {session.videoMeta?.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          {session.videoMeta.slice(0, 3).map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {v.thumbnail && (
                <img src={v.thumbnail} alt="" style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 10, color: 'var(--text-3)', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.video_title?.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>
          ))}
          {session.videoMeta.length > 3 && (
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>+{session.videoMeta.length - 3}</span>
          )}
        </div>
      )}

      {/* meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {session.messages?.filter(m => m.role === 'user').length || 0} messages · {timeAgo}
        </span>
        {hovered && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(session.id) }}
            style={{ width: 14, height: 14, borderRadius: 2, border: 'none', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >×</button>
        )}
      </div>
    </div>
  )
}

export default function LeftSidebar({
  videos, activeVideoId, onSelectVideo, onRemoveVideo, onAddVideo,
  sessions, activeSessionId, groupedSessions,
  onSelectSession, onDeleteSession, onClearSessions, onNewSession
}) {
  const [videosOpen, setVideosOpen] = useState(true)
  const [sessionsOpen, setSessionsOpen] = useState(true)
  const GROUP_ORDER = ['Today', 'Yesterday', 'This week', 'Older']

  return (
    <div style={{
      width: 'var(--sidebar-w)', flexShrink: 0,
      background: 'var(--ink-2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>

        {/* Videos */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 4px 6px', marginBottom: 1 }}>
            <button onClick={() => setVideosOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ fontSize: 8, color: 'var(--text-3)', transform: videosOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', display: 'inline-block' }}>▶</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Videos</span>
            </button>
            <button onClick={onAddVideo} title="Add video"
              style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid var(--border-md)', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-3)' }}
            >+</button>
          </div>

          {videosOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {videos.length === 0 && (
                <div style={{ padding: '10px 6px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>No videos yet</p>
                  <button onClick={onAddVideo} style={{ marginTop: 6, fontSize: 11, color: 'var(--violet)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    + Add your first video
                  </button>
                </div>
              )}
              {videos.map(v => (
                <VideoItem key={v.video_id} video={v}
                  active={v.video_id === activeVideoId}
                  onSelect={onSelectVideo} onRemove={onRemoveVideo} />
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 3px 10px' }} />

        {/* Sessions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 4px 6px', marginBottom: 1 }}>
            <button onClick={() => setSessionsOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ fontSize: 8, color: 'var(--text-3)', transform: sessionsOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', display: 'inline-block' }}>▶</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Chat history</span>
            </button>
            <button onClick={onNewSession} title="New conversation"
              style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid var(--border-md)', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-3)' }}
            >✎</button>
          </div>

          {sessionsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sessions.length === 0 && (
                <p style={{ fontSize: 11, color: 'var(--text-3)', padding: '6px 6px', lineHeight: 1.5 }}>
                  Ask a question to start a session
                </p>
              )}
              {GROUP_ORDER.filter(g => groupedSessions[g]?.length).map(group => (
                <div key={group}>
                  <p style={{ fontSize: 9, color: 'var(--text-3)', padding: '5px 6px 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {group}
                  </p>
                  {groupedSessions[group].map(s => (
                    <SessionItem key={s.id} session={s}
                      active={s.id === activeSessionId}
                      onSelect={onSelectSession} onDelete={onDeleteSession} />
                  ))}
                </div>
              ))}
              {sessions.length > 0 && (
                <button onClick={onClearSessions}
                  style={{ marginTop: 8, fontSize: 10, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'color var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  Clear all sessions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}