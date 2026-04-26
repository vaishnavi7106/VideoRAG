import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useVideoStore } from './hooks/useVideoStore'
import { useSessions } from './hooks/useSessions'
import Topbar from './components/Topbar'
import LandingPage from './pages/LandingPage'
import WorkspacePage from './pages/WorkspacePage'

export default function App() {
  const { dark, toggle } = useTheme()
  const videoStore = useVideoStore()
  const sessions = useSessions()
  const [page, setPage] = useState('landing') // 'landing' | 'workspace'
  const [showModal, setShowModal] = useState(false)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {page === 'workspace' && (
        <Topbar
          dark={dark}
          toggleDark={toggle}
          showWorkspace
          onAddVideo={() => setShowModal(true)}
        />
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {page === 'landing' ? (
          <LandingPage onEnter={() => setPage('workspace')} />
        ) : (
          <WorkspacePage
            videoStore={videoStore}
            sessions={sessions}
            showModal={showModal}
            onCloseModal={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  )
}