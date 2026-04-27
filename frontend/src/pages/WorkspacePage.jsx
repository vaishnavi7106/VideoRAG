import { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatPanel from '../components/ChatPanel'
import SummaryTab from '../components/tabs/SummaryTab'
import SearchTab from '../components/tabs/SearchTab'
import StudyTab from '../components/tabs/StudyTab'
import AddVideoModal from '../components/AddVideoModal'
import { askQuestion, generateSessionTitle as generateSessionTitleApi } from '../services/api'
import { useSearch } from '../hooks/useSearch'
import { useStudy } from '../hooks/useStudy'

const TABS = ['Summary', 'Search', 'Study']

const OUT_OF_CONTEXT = new Set([
  'hi', 'hello', 'hey', 'hii', 'hiii', 'sup', 'yo', 'hola',
  'thanks', 'thank you', 'ok', 'okay', 'cool', 'nice', 'good',
  'great', 'bye', 'goodbye', 'lol', 'lmao', 'haha', 'hmm',
  'test', 'testing', 'ping'
])

function isOutOfContext(question) {
  const q = question.trim().toLowerCase().replace(/[?!.,]/g, '')
  if (OUT_OF_CONTEXT.has(q)) return true
  const words = q.split(' ')
  if (words.length <= 2) {
    const hasQuestionWord = [
      'who', 'what', 'when', 'where', 'why', 'how',
      'did', 'does', 'is', 'are', 'was', 'were',
      'can', 'could', 'would', 'should', 'will'
    ].some(w => words.includes(w))
    return !hasQuestionWord
  }
  return false
}

const OUT_OF_CONTEXT_REPLIES = [
  "I can only answer questions about the videos you've loaded. Ask me anything about their content!",
  "I'm focused on the video content. Try asking something about what's covered in the videos.",
  "That's outside my scope — I only know what's in the loaded videos. What would you like to know about them?",
]

export default function WorkspacePage({
  videoStore,
  sessions,
  showModal: externalModal,
  onCloseModal
}) {
  const {
    videos,
    activeVideoId,
    activeVideo,
    readyVideos,
    setActiveVideoId,
    addVideo,
    removeVideo,
    clearVideos
  } = videoStore

  const {
    sessions: sessionList,
    activeSessionId,
    activeSession,
    groupedSessions,
    setActiveSessionId,
    createSession,
    appendMessage,
    updateTitle,
    deleteSession,
    clearAllSessions
  } = sessions

  const [internalModal, setInternalModal] = useState(false)
  const [activeTab, setActiveTab] = useState('Summary')
  const [answerMode, setAnswerMode] = useState('concise')
  const [asking, setAsking] = useState(false)

  const search = useSearch()
  const study = useStudy()

  const modalOpen = externalModal || internalModal
  const urls = readyVideos.map(v => v._url)
  const messages = activeSession?.messages || []

  function closeModal() {
    setInternalModal(false)
    onCloseModal?.()
  }

  function handleAddVideo(vid) {
    addVideo(vid)
    closeModal()
    setActiveTab('Summary')
  }

  // ── new conversation: clear everything ──
  function handleNewSession() {
    setActiveSessionId(null)
    clearVideos()           // ← clears videos panel
    search.clear()          // ← clears search state
    study.reset()           // ← clears study state
    setActiveTab('Summary')
  }

  // ── session switching: restore that session's videos ──
  function handleSelectSession(id) {
    const session = sessionList.find(s => s.id === id)
    if (!session) return

    setActiveSessionId(id)

    if (session.videoData?.length > 0) {
      clearVideos()
      session.videoData.forEach(vid => {
        addVideo({ ...vid, status: 'ready' })
      })
      if (session.videoData[0]?.video_id) {
        setActiveVideoId(session.videoData[0].video_id)
      }
    }

    setActiveTab('Summary')
    search.clear()
    study.reset()
  }

  async function handleAsk(question) {
    if (!question.trim() || asking) return

    // out-of-context guard
    if (isOutOfContext(question)) {
      const reply = OUT_OF_CONTEXT_REPLIES[
        Math.floor(Math.random() * OUT_OF_CONTEXT_REPLIES.length)
      ]
      let sessionId = activeSessionId
      if (!sessionId) {
        sessionId = createSession(
          readyVideos.map(v => v.video_id),
          readyVideos.map(v => ({
            video_id: v.video_id,
            video_title: v.video_title,
            thumbnail: v.thumbnail
          })),
          readyVideos
        )
      }
      appendMessage(sessionId, { role: 'user', content: question, ts: Date.now() })
      appendMessage(sessionId, { role: 'assistant', content: reply, sources: [], ts: Date.now() })
      return
    }

    if (urls.length === 0) return

    let sessionId = activeSessionId
    const isNewSession = !sessionId

    if (isNewSession) {
      sessionId = createSession(
        readyVideos.map(v => v.video_id),
        readyVideos.map(v => ({
          video_id: v.video_id,
          video_title: v.video_title,
          thumbnail: v.thumbnail
        })),
        readyVideos
      )
    }

    const userMsg = { role: 'user', content: question, ts: Date.now() }
    appendMessage(sessionId, userMsg)
    setAsking(true)

    const history = (activeSession?.messages || []).map(m => ({
      role: m.role,
      content: m.content
    }))

    try {
      const data = await askQuestion(urls, question, answerMode, history)
      const assistantMsg = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        mode: data.mode,
        ts: Date.now()
      }
      appendMessage(sessionId, assistantMsg)

      if (isNewSession) {
        generateSessionTitleApi(question, readyVideos.map(v => v.video_title))
          .then(result => { if (result?.title) updateTitle(sessionId, result.title) })
          .catch(() => {})
      }
    } catch (e) {
      appendMessage(sessionId, {
        role: 'assistant',
        content: e.message || 'Something went wrong. Please try again.',
        sources: [],
        ts: Date.now()
      })
    } finally {
      setAsking(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - var(--topbar-h))',
      overflow: 'hidden',
      background: 'var(--ink)'
    }}>

      {/* LEFT SIDEBAR */}
      <LeftSidebar
        videos={videos}
        activeVideoId={activeVideoId}
        onSelectVideo={id => { setActiveVideoId(id); setActiveTab('Summary') }}
        onRemoveVideo={removeVideo}
        onAddVideo={() => setInternalModal(true)}
        sessions={sessionList}
        activeSessionId={activeSessionId}
        groupedSessions={groupedSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
        onClearSessions={clearAllSessions}
        onNewSession={handleNewSession}
      />

      {/* CENTER PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', borderRight: '1px solid var(--border)',
        background: 'var(--ink)', position: 'relative'
      }}>
        {/* tab bar — with transcript download inline */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center',
          padding: '0 6px', borderBottom: '1px solid var(--border)',
          background: 'var(--ink-2)', flexShrink: 0, gap: 2
        }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                height: 34, padding: '0 14px',
                borderRadius: 'var(--radius-md)', border: 'none',
                background: activeTab === tab ? 'var(--ink-3)' : 'transparent',
                color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
                fontSize: 13, fontWeight: activeTab === tab ? 500 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition)', position: 'relative'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{
                  position: 'absolute', bottom: -1, left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50%', height: 2,
                  background: 'var(--violet)', borderRadius: 99,
                  boxShadow: '0 0 8px var(--violet-glow)'
                }} />
              )}
            </button>
          ))}

          {/* right side of tab bar */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
            {/* transcript download — visible when a video is loaded */}
            {activeVideo && activeVideo.status === 'ready' && (
              <TranscriptDownloadInline video={activeVideo} />
            )}

            {/* active video badge */}
            {activeVideo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {activeVideo.thumbnail && (
                  <img
                    src={activeVideo.thumbnail} alt=""
                    style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 3 }}
                  />
                )}
                <span style={{
                  fontSize: 11, color: 'var(--text-3)',
                  maxWidth: 150, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {activeVideo.video_title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* tab content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTab === 'Summary' && <SummaryTab video={activeVideo} />}
          {activeTab === 'Search' && <SearchTab video={activeVideo} search={search} />}
          {activeTab === 'Study' && <StudyTab video={activeVideo} study={study} />}
        </div>

        {/* empty state */}
        {videos.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📺</div>
            <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 6 }}>
              No videos loaded
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Click "+ Add Video" to get started
            </p>
          </div>
        )}
      </div>

      {/* RIGHT CHAT PANEL */}
      <div style={{ width: 'var(--chat-w)', flexShrink: 0 }}>
        <ChatPanel
          videos={readyVideos}
          messages={messages}
          onAsk={handleAsk}
          loading={asking}
          answerMode={answerMode}
          onModeChange={setAnswerMode}
        />
      </div>

      {/* ADD VIDEO MODAL */}
      {modalOpen && (
        <AddVideoModal
          onClose={closeModal}
          onAdd={handleAddVideo}
          existingUrls={videos.map(v => v._url).filter(Boolean)}
        />
      )}
    </div>
  )
}

// ── inline transcript download button for the tab bar ──
function TranscriptDownloadInline({ video }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (!video?._url || loading) return
    setLoading(true)
    try {
      const { getTranscript } = await import('../services/api')
      const data = await getTranscript(video._url)
      const blob = new Blob([data.transcript_text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(video.video_title || 'transcript').slice(0, 40).replace(/[^a-z0-9]/gi, '_')}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // silent fail — not critical
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title="Download transcript as .txt"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 28, padding: '0 10px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-md)',
        background: 'transparent',
        color: 'var(--text-3)', fontSize: 11,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'all var(--transition)',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.borderColor = 'var(--border-lg)'
          e.currentTarget.style.color = 'var(--text)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-md)'
        e.currentTarget.style.color = 'var(--text-3)'
      }}
    >
      {loading ? '⟳' : '↓'} Transcript
    </button>
  )
}