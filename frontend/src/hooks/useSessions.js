import { useState, useCallback } from 'react'

const KEY = 'vr-sessions-v4'
const MAX_SESSIONS = 40

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

function save(sessions) {
  try { localStorage.setItem(KEY, JSON.stringify(sessions)) }
  catch (e) { console.warn('Session save failed', e) }
}

export function useSessions() {
  const [sessions, setSessions] = useState(load)
  const [activeSessionId, setActiveSessionId] = useState(null)

  const createSession = useCallback((videoIds, videoMeta, videoData) => {
    // videoMeta: [{video_id, video_title, thumbnail}]
    // videoData: full video objects including summary, key_sections, worth_watching
    const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const session = {
      id,
      videoIds,
      videoMeta: videoMeta || [],
      videoData: videoData || [],  // ← full video objects stored here
      messages: [],
      title: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    setSessions(prev => {
      const next = [session, ...prev].slice(0, MAX_SESSIONS)
      save(next)
      return next
    })
    setActiveSessionId(id)
    return id
  }, [])

  const appendMessage = useCallback((sessionId, message) => {
    setSessions(prev => {
      const next = prev.map(s => {
        if (s.id !== sessionId) return s
        return { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
      })
      save(next)
      return next
    })
  }, [])

  const updateTitle = useCallback((sessionId, title) => {
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, title } : s)
      save(next)
      return next
    })
  }, [])

  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId)
      save(next)
      return next
    })
    setActiveSessionId(prev => prev === sessionId ? null : prev)
  }, [])

  const clearAllSessions = useCallback(() => {
    localStorage.removeItem(KEY)
    setSessions([])
    setActiveSessionId(null)
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId) || null

  const groupedSessions = sessions.reduce((acc, session) => {
    const diff = Date.now() - session.updatedAt
    const day = 86400000
    let group
    if (diff < day) group = 'Today'
    else if (diff < 2 * day) group = 'Yesterday'
    else if (diff < 7 * day) group = 'This week'
    else group = 'Older'
    if (!acc[group]) acc[group] = []
    acc[group].push(session)
    return acc
  }, {})

  return {
    sessions,
    activeSessionId,
    activeSession,
    groupedSessions,
    setActiveSessionId,
    createSession,
    appendMessage,
    updateTitle,
    deleteSession,
    clearAllSessions
  }
}