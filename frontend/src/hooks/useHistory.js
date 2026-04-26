import { useState, useCallback } from 'react'

const MAX = 5
const KEY = 'vr-history'

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  const addToHistory = useCallback((question) => {
    setHistory(prev => {
      const filtered = prev.filter(q => q !== question)
      const next = [question, ...filtered].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(KEY)
    setHistory([])
  }, [])

  return { history, addToHistory, clearHistory }
}