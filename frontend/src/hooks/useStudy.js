import { useState, useCallback } from 'react'
import { fetchStudy } from '../services/api'

export function useStudy() {
  const [questions, setQuestions] = useState([])
  const [answered, setAnswered] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async (url) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStudy(url)
      setQuestions(data.questions || [])
      setAnswered(new Set())
      setLoaded(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAnswered = useCallback((idx) => {
    setAnswered(prev => new Set([...prev, idx]))
  }, [])

  const reset = useCallback(() => {
    setQuestions([])
    setAnswered(new Set())
    setLoaded(false)
    setError(null)
  }, [])

  return { questions, answered, loading, error, loaded, load, markAnswered, reset }
}