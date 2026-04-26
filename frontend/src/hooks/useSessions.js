import { useState, useCallback } from 'react'

const KEY = 'vr-sessions-v2'
const MAX_SESSIONS = 30

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

function save(sessions) {
  localStorage.setItem(KEY, JSON.stringify(sessions))
}

export function useSessions() {
  const [sessions, setSessions] = useState(load)
  const [activeSessionId, setActiveSessionId] = useState(null)

  const createSession = useCallback((videoIds, videoTitles) => {
    const id = `session_${Date.now()}`
    const session = {
      id,
      videoIds,
      videoTitles,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: null // set from first question
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
        const messages = [...s.messages, message]
        // use first user question as session title
        const title = s.title || (message.role === 'user' ? message.content : null)
        return { ...s, messages, title, updatedAt: Date.now() }
      })
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

  // group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    const now = Date.now()
    const diff = now - session.updatedAt
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
    deleteSession,
    clearAllSessions
  }
}