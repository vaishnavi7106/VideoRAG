import { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatPanel from '../components/ChatPanel'
import SummaryTab from '../components/tabs/SummaryTab'
import SearchTab from '../components/tabs/SearchTab'
import StudyTab from '../components/tabs/StudyTab'
import AddVideoModal from '../components/AddVideoModal'
import { askQuestion } from '../services/api'
import { useSearch } from '../hooks/useSearch'
import { useStudy } from '../hooks/useStudy'

const TABS = ['Summary', 'Search', 'Study']

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
    removeVideo
  } = videoStore

  const {
    sessions: sessionList,
    activeSessionId,
    activeSession,
    groupedSessions,
    setActiveSessionId,
    createSession,
    appendMessage,
    deleteSession,
    clearAllSessions
  } = sessions

  const [internalModal, setInternalModal] = useState(false)
  const [activeTab, setActiveTab] = useState('Summary')
  const [answerMode, setAnswerMode] = useState('concise')
  const [asking, setAsking] = useState(false)

  const modalOpen = externalModal || internalModal

  const search = useSearch()
  const study = useStudy()

  const messages = activeSession?.messages || []
  const urls = readyVideos.map(v => v._url)

  async function handleAsk(question) {
    if (!question.trim() || asking || urls.length === 0) return

    let sessionId = activeSessionId

    if (!sessionId) {
      sessionId = createSession(
        readyVideos.map(v => v.video_id),
        readyVideos.map(v => v.video_title)
      )
    }

    const userMsg = {
      role: 'user',
      content: question,
      ts: Date.now()
    }

    appendMessage(sessionId, userMsg)
    setAsking(true)

    const history = (activeSession?.messages || []).map(m => ({
      role: m.role,
      content: m.content
    }))

    try {
      const data = await askQuestion(
        urls,
        question,
        answerMode,
        history
      )

      const assistantMsg = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        mode: data.mode,
        ts: Date.now()
      }

      appendMessage(sessionId, assistantMsg)
    } catch (e) {
      appendMessage(sessionId, {
        role: 'assistant',
        content: e.message || 'Something went wrong.',
        sources: [],
        ts: Date.now()
      })
    } finally {
      setAsking(false)
    }
  }

  function handleNewSession() {
    setActiveSessionId(null)
  }

  function handleSelectSession(id) {
    setActiveSessionId(id)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - var(--topbar-h))',
        overflow: 'hidden',
        background: 'var(--ink)'
      }}
    >
      <LeftSidebar
        videos={videos}
        activeVideoId={activeVideoId}
        onSelectVideo={id => {
          setActiveVideoId(id)
          setActiveTab('Summary')
        }}
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

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid var(--border)'
        }}
      >
        <div
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--ink-2)',
            flexShrink: 0,
            position: 'relative',
            gap: 2
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background:
                  activeTab === tab
                    ? 'var(--ink-3)'
                    : 'transparent',
                color:
                  activeTab === tab
                    ? 'var(--text)'
                    : 'var(--text-3)',
                fontSize: 13,
                fontWeight: activeTab === tab ? 500 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition)',
                position: 'relative'
              }}
            >
              {tab}

              {activeTab === tab && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: 2,
                    background: 'var(--violet)',
                    borderRadius: 99,
                    boxShadow:
                      '0 0 8px var(--violet-glow)'
                  }}
                />
              )}
            </button>
          ))}

          {activeVideo && (
            <div
              style={{
                marginLeft: 'auto',
                marginRight: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {activeVideo.thumbnail && (
                <img
                  src={activeVideo.thumbnail}
                  alt=""
                  style={{
                    width: 22,
                    height: 15,
                    objectFit: 'cover',
                    borderRadius: 3
                  }}
                />
              )}

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-3)',
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {activeVideo.video_title}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'hidden'
          }}
        >
          {activeTab === 'Summary' && (
            <SummaryTab video={activeVideo} />
          )}

          {activeTab === 'Search' && (
            <SearchTab
              video={activeVideo}
              search={search}
            />
          )}

          {activeTab === 'Study' && (
            <StudyTab
              video={activeVideo}
              study={study}
            />
          )}
        </div>
      </div>

      <div
        style={{
          width: 'var(--chat-w)',
          flexShrink: 0
        }}
      >
        <ChatPanel
          videos={readyVideos}
          messages={messages}
          onAsk={handleAsk}
          loading={asking}
          answerMode={answerMode}
          onModeChange={setAnswerMode}
        />
      </div>

      {modalOpen && (
        <AddVideoModal
          onClose={() => {
            setInternalModal(false)
            onCloseModal?.()
          }}
          onAdd={vid => {
            addVideo(vid)
            setInternalModal(false)
            onCloseModal?.()
          }}
          existingUrls={videos
            .map(v => v._url)
            .filter(Boolean)}
        />
      )}
    </div>
  )
}